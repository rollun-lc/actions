import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  D2CServiceConfig,
  EntitiesResponse,
  EntityHost,
  EntityProject,
  EntityService,
  GenerateHookResponse,
  LoginResponse,
} from './types';
import { createUpdateWebhookByServiceId, findServiceByName } from './utils';
import _ from 'lodash';
import { wait } from 'better-wait';
import * as core from '@actions/core';
import { renderFile } from 'ejs';
import fs from 'fs';

type D2cApiClientOptions = {
  baseUrl: string;
};

class D2CBasicClient {
  protected api: AxiosInstance;

  constructor(options: D2cApiClientOptions) {
    this.api = axios.create({
      baseURL: options.baseUrl,
    });

    this.api.interceptors.request.use((config) => {
      if (config.method !== 'GET') {
        core.info(`${config.method} ${config.url}`);
      }
      return config;
    });
    this.api.interceptors.response.use(undefined,  (error: AxiosError) => {
      if (error.response?.data) {
        core.error(error.response?.data.message || JSON.stringify(error.response?.data));
      }
      throw error;
    });
  }
  public async authenticate(email: string, password: string) {
    const { data } = await this.api
      .post<LoginResponse>('/login', {
        email,
        password,
      })
      .catch(createD2cError);

    const token = data?.member?.token;
    if (!token) {
      core.info(JSON.stringify(data));
      throw new Error('No token returned from the API');
    }

    this.setToken(token);
  }

  private setToken(token: string) {
    this.api.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    }));
  }
}

class D2cApiClient extends D2CBasicClient {
  entitiesCache: EntitiesResponse | null = null;

  public async fetchAllEntities(force = false) {
    if (!force && this.entitiesCache) {
      return this.entitiesCache;
    }

    const { data } = await this.api
      .get<EntitiesResponse>('/v1/acc/entities')
      .catch(createD2cError);

    return (this.entitiesCache = data);
  }

  public async getServiceInternalDomain(id: string): Promise<string> {
    const entities = await this.fetchAllEntities();

    const shortAccountId = entities.result.accounts[0].shortId;

    const service = await this.fetchServiceById(id);
    if (!service) {
      throw new Error('no such service ' + id);
    }

    return `${service.name}-www.${shortAccountId}.at.d2c.io`;
  }

  public async fetchAllServices(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.services;
  }

  public async fetchAllProjects(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.projects;
  }

  public async fetchAllHosts(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.hosts;
  }

  public async fetchServiceByName(
    serviceName: string,
    force = false,
  ): Promise<EntityService | null> {
    const services = await this.fetchAllServices(force);
    const serviceInfo = findServiceByName(services, serviceName);

    return serviceInfo || null;
  }

  public async fetchServiceById(
    serviceId: string,
    force = false,
  ): Promise<EntityService | null> {
    const services = await this.fetchAllServices(force);
    const serviceInfo = services.find(({ id }) => id === serviceId) || null;

    return serviceInfo || null;
  }

  public async fetchProjectByName(
    projectName: string,
    force = false,
  ): Promise<EntityProject | null> {
    const projects = await this.fetchAllProjects(force);

    return projects.find(({ name }) => name === projectName) || null;
  }

  public async fetchHostByName(
    hostName: string,
    force = false,
  ): Promise<EntityHost | null> {
    const hosts = await this.fetchAllHosts(force);

    return hosts.find(({ name }) => name === hostName) || null;
  }

  public async triggerServiceUpdate(
    serviceId: string,
    actions = 'updateSources,updateLocalDeps,updateGlobalDeps,updateVersion',
  ) {
    const {
      data: { result: webhookId },
    } = await this.api
      .get<GenerateHookResponse>(`/v1/service/${serviceId}/hook`, {
        params: {
          generate: false,
        },
      })
      .catch(createD2cError);

    const webhook = createUpdateWebhookByServiceId(webhookId, actions);

    const { status } = await this.api.get(webhook).catch(createD2cError);

    return status;
  }

  public async awaitServiceAction(serviceId: string) {
    let service;
    do {
      core.info('checking service progress in 2s...');
      await wait('2s');

      service = (await this.fetchServiceById(serviceId, true)) as EntityService;
      core.info(`service progress is [${service.process}]`);
    } while (service.process !== '');
  }

  public async prepareServicePayload(
    type: string,
    config: D2CServiceConfig,
  ): Promise<Record<string, unknown>> {
    if (type === 'docker') {
      return {
        network: 'weave',
        volumesUID: 0,
        source: { type: 'download', url: '' },
      };
    }

    if (type === 'nginx') {
      // resolve services name to service id
      const services = config['d2c-service-config'].services || [];
      const resolvedServices = services.map(
        async ({ name, appRoot, config, type, file }) => {
          const service = await this.fetchServiceByName(name);
          if (!service) {
            throw new Error('no such service ' + name);
          }

          let configStr = config;

          if (type === 'custom') {
            if (!file) {
              throw new Error("no 'file' specified for custom config");
            }
            configStr = fs.readFileSync(file, 'utf8');
          } else {
            configStr = await renderFile(
              __dirname +
                `/templates/nginx-${type}-service-proxy.conf.template`,
              { appRoot },
            );
          }

          return {
            id: service.id,
            cert: '',
            domains: [await this.getServiceInternalDomain(service.id)],
            https: 'none',
            key: '',
            secure: 'high',
            static: false,
            name,
            config: configStr,
          };
        },
      );

      return {
        services: await Promise.all(resolvedServices),
        configs: config['d2c-service-config'].configs || [
          {
            custom: false,
            name: 'nginx.conf',
            text: await renderFile(
              __dirname + '/templates/default-nginx-root.conf.template',
            ),
          },
        ],
      };
    }

    throw new Error('unknown service type');
  }

  public async resolveEnvVars(
    env: D2CServiceConfig['d2c-service-config']['env'],
  ) {
    if (!env?.length) {
      return [];
    }

    let resolvedEnvs: D2CServiceConfig['d2c-service-config']['env'] = [];

    const envVarPattern = /\$\{(.+?)\}/gm;
    for (const { name, value } of env) {
      let castedValue = value === undefined ? '' : `${value}`;
      if (!envVarPattern.test(castedValue)) {
        // env does not contain reference to env var like ${TEST_ENV}
        resolvedEnvs.push({ name, value: castedValue });
        continue;
      }

      const resolvedValue = castedValue.replaceAll(envVarPattern, (_, envName) => {
        const envVar = process.env[envName];
        if (!envVar) {
          throw new Error(`env var ${envName} not found`);
        }
        return envVar;
      });

      resolvedEnvs.push({ name, value: resolvedValue });
    }

    return resolvedEnvs;
  }

  public async updateService(
    config: D2CServiceConfig,
    service?: EntityService | null,
  ) {
    const {
      project: projectName,
      type,
      name,
      crons,
      ...restConfig
    } = config['d2c-service-config'];

    const project = await this.fetchProjectByName(projectName);
    if (!project) {
      throw new Error('project not found by ' + projectName);
    }

    let payload: Record<string, unknown> = {
      ...restConfig,
      ...(restConfig.env
        ? { env: await this.resolveEnvVars(restConfig.env) }
        : {}),
    };

    if (!service) {
      const host = await this.fetchHostByName(config['initial-service-host']);
      if (!host) {
        throw new Error(
          'Initial host not found by ' + config['initial-service-host'],
        );
      }

      payload.hosts = [
        {
          id: host.id,
          role: 'node',
        },
      ];
      payload.name = name;
      payload.project = project.id;
      payload.crons = crons;
    } else {
      if (service.project !== project.id) {
        await this.api.put(
          `/v1/service/${service.id}/changeProject?project=${project.id}`,
        );
        await this.awaitServiceAction(service.id);
      }

      if (
        crons &&
        (crons.length !== service.crons.length ||
          !crons.every((newCron) =>
            service.crons.some((oldCron) => _.isMatch(oldCron, newCron)),
          ))
      ) {
        await this.api.put(`/v1/service/${service.id}/cron`, crons);
        await this.awaitServiceAction(service.id);
      }
    }

    payload = {
      ...payload,
      ...(await this.prepareServicePayload(type, config)),
    };

    core.info(JSON.stringify({ ...payload, env: '*** reducted ***' }));

    if (service) {
      if (!_.isMatch(service, payload)) {
        core.info('detected changes in config, updating service');
        await this.api.put(`/v1/service/${type}/${service.id}`, payload);
      } else {
        core.info('no changes in config, triggering service update');
        await this.triggerServiceUpdate(service.id);
      }
        await this.awaitServiceAction(service.id);
    } else {
      const { data } = await this.api.post(`/v1/service/${type}`, payload);
      const serviceId = data.result.id;
      await this.awaitServiceAction(serviceId);
    }
  }
}

const createD2cError = (e: AxiosError) => {
  throw new Error(
    `Request [${e.request?.path}] failed with status [${e.response?.status}].\n Response - [${e.response?.data}]`,
  );
};

export { D2cApiClient, createD2cError };
