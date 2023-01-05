import axios, { AxiosError, AxiosInstance } from 'axios';
import { D2CServiceConfig, EntitiesResponse, EntityHost, EntityProject, EntityService, GenerateHookResponse, LoginResponse } from './types';
import { createUpdateWebhookByServiceId, findServiceByName } from './utils';
import _ from 'lodash';
import { wait } from 'better-wait';

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
        console.log(`${config.method} ${config.url}`);
      }
      return config;
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
      console.log(data);
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
      return this.entitiesCache
    }

    const { data } = await this.api
      .get<EntitiesResponse>('/v1/acc/entities')
      .catch(createD2cError);

    return (this.entitiesCache = data);
  }

  public async fetchAllServices(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.services
  }

  public async fetchAllProjects(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.projects;
  }

  public async fetchAllHosts(force = false) {
    const entities = await this.fetchAllEntities(force);

    return entities.result.hosts;
  }

  public async fetchServiceByName(serviceName: string, force = false): Promise<EntityService | null> {
    const services = await this.fetchAllServices(force);
    const serviceInfo = findServiceByName(services, serviceName);

    return serviceInfo || null;
  }

  public async fetchServiceById(serviceId: string, force = false): Promise<EntityService | null> {
    const services = await this.fetchAllServices(force);
    const serviceInfo = services.find(({ id }) => id === serviceId) || null;

    return serviceInfo || null;
  }

  public async fetchProjectByName(projectName: string, force = false): Promise<EntityProject | null> {
    const projects = await this.fetchAllProjects(force);

    return projects.find(({ name }) => name === projectName) || null;
  }

  public async fetchHostByName(hostName: string, force = false): Promise<EntityHost | null> {
    const hosts = await this.fetchAllHosts(force);

    return hosts.find(({ name }) => name === hostName) || null;
  }

  public async triggerServiceUpdate(serviceId, actions = 'updateSources,updateLocalDeps,updateGlobalDeps,updateVersion') {
    const { data: { result: webhookId } } = await this.api
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
    console.log('checking service progress in 2s...');
    await wait('2s');

    service = await this.fetchServiceById(serviceId, true) as EntityService;
    console.log(`service progress is [${service.process}]`);
   } while (service.process !== '');
  }

  public async updateService(config: D2CServiceConfig, service?: EntityService | null) {
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


    const payload: Record<string, unknown> = {
      ...restConfig,
      network: 'weave',
      volumesUID: 0,
      source: { type: 'download', url: '' },
    }

    if (!service) {
      const host = await this.fetchHostByName(config['initial-service-host']);
      if (!host) {
        throw new Error('initial host not found by ' + config['initial-service-host']);
      }

      payload.hosts = [
        {
          id: host.id,
          role: 'node',
        }
      ];
      payload.name = name;
      payload.project = project.id;
      payload.crons = crons;
    } else {
      if (service.project !== project.id) {
        await this.api.put(`/v1/service/${service.id}/changeProject?project=${project.id}`);
        await this.awaitServiceAction(service.id);
      }

      if (
        crons.length !== service.crons.length ||
        !crons.every((newCron) => service.crons.some((oldCron) => _.isMatch(oldCron, newCron)))
      ) {
        await this.api.put(`/v1/service/${service.id}/cron`, crons);
        await this.awaitServiceAction(service.id);
      }
    }

    console.log('payload', payload);

    if (service) {
      if (!_.isMatch(service, payload)) {
        await this.api.put(`/v1/service/${type}/${service.id}`, payload)
        await this.awaitServiceAction(service.id);
      } else {
        console.log('no changes to the service, skip update')
      }
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
