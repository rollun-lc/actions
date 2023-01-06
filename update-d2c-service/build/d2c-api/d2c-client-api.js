"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createD2cError = exports.D2cApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const lodash_1 = __importDefault(require("lodash"));
const better_wait_1 = require("better-wait");
const core = __importStar(require("@actions/core"));
class D2CBasicClient {
    api;
    constructor(options) {
        this.api = axios_1.default.create({
            baseURL: options.baseUrl,
        });
        this.api.interceptors.request.use((config) => {
            if (config.method !== 'GET') {
                core.info(`${config.method} ${config.url}`);
            }
            return config;
        });
    }
    async authenticate(email, password) {
        const { data } = await this.api
            .post('/login', {
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
    setToken(token) {
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
    entitiesCache = null;
    async fetchAllEntities(force = false) {
        if (!force && this.entitiesCache) {
            return this.entitiesCache;
        }
        const { data } = await this.api
            .get('/v1/acc/entities')
            .catch(createD2cError);
        return (this.entitiesCache = data);
    }
    async fetchAllServices(force = false) {
        const entities = await this.fetchAllEntities(force);
        return entities.result.services;
    }
    async fetchAllProjects(force = false) {
        const entities = await this.fetchAllEntities(force);
        return entities.result.projects;
    }
    async fetchAllHosts(force = false) {
        const entities = await this.fetchAllEntities(force);
        return entities.result.hosts;
    }
    async fetchServiceByName(serviceName, force = false) {
        const services = await this.fetchAllServices(force);
        const serviceInfo = (0, utils_1.findServiceByName)(services, serviceName);
        return serviceInfo || null;
    }
    async fetchServiceById(serviceId, force = false) {
        const services = await this.fetchAllServices(force);
        const serviceInfo = services.find(({ id }) => id === serviceId) || null;
        return serviceInfo || null;
    }
    async fetchProjectByName(projectName, force = false) {
        const projects = await this.fetchAllProjects(force);
        return projects.find(({ name }) => name === projectName) || null;
    }
    async fetchHostByName(hostName, force = false) {
        const hosts = await this.fetchAllHosts(force);
        return hosts.find(({ name }) => name === hostName) || null;
    }
    async triggerServiceUpdate(serviceId, actions = 'updateSources,updateLocalDeps,updateGlobalDeps,updateVersion') {
        const { data: { result: webhookId } } = await this.api
            .get(`/v1/service/${serviceId}/hook`, {
            params: {
                generate: false,
            },
        })
            .catch(createD2cError);
        const webhook = (0, utils_1.createUpdateWebhookByServiceId)(webhookId, actions);
        const { status } = await this.api.get(webhook).catch(createD2cError);
        return status;
    }
    async awaitServiceAction(serviceId) {
        let service;
        do {
            core.info('checking service progress in 2s...');
            await (0, better_wait_1.wait)('2s');
            service = await this.fetchServiceById(serviceId, true);
            core.info(`service progress is [${service.process}]`);
        } while (service.process !== '');
    }
    async updateService(config, service) {
        const { project: projectName, type, name, crons, ...restConfig } = config['d2c-service-config'];
        const project = await this.fetchProjectByName(projectName);
        if (!project) {
            throw new Error('project not found by ' + projectName);
        }
        const payload = {
            ...restConfig,
            network: 'weave',
            volumesUID: 0,
            source: { type: 'download', url: '' },
        };
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
        }
        else {
            if (service.project !== project.id) {
                await this.api.put(`/v1/service/${service.id}/changeProject?project=${project.id}`);
                await this.awaitServiceAction(service.id);
            }
            if (crons.length !== service.crons.length ||
                !crons.every((newCron) => service.crons.some((oldCron) => lodash_1.default.isMatch(oldCron, newCron)))) {
                await this.api.put(`/v1/service/${service.id}/cron`, crons);
                await this.awaitServiceAction(service.id);
            }
        }
        core.info(JSON.stringify(payload));
        if (service) {
            if (!lodash_1.default.isMatch(service, payload)) {
                await this.api.put(`/v1/service/${type}/${service.id}`, payload);
                await this.awaitServiceAction(service.id);
            }
            else {
                core.info('no changes to the service, skip update');
            }
        }
        else {
            const { data } = await this.api.post(`/v1/service/${type}`, payload);
            const serviceId = data.result.id;
            await this.awaitServiceAction(serviceId);
        }
    }
}
exports.D2cApiClient = D2cApiClient;
const createD2cError = (e) => {
    throw new Error(`Request [${e.request?.path}] failed with status [${e.response?.status}].\n Response - [${e.response?.data}]`);
};
exports.createD2cError = createD2cError;
