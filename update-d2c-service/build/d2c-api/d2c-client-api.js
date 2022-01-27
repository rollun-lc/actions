"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createD2cError = exports.D2cApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
class D2cApiClient {
    api;
    static baseUrl = 'https://api.d2c.io/';
    constructor() {
        this.api = axios_1.default.create({
            baseURL: D2cApiClient.baseUrl,
        });
    }
    async updateServiceByServiceName(serviceName, actions) {
        const serviceId = await this.fetchServiceIdByName(serviceName);
        const hookId = await this.fetchHookIdByServiceId(serviceId);
        if (!hookId) {
            throw new Error(`Could not find hook id by service - [${serviceName}] with id - [${serviceId}]`);
        }
        const webhook = (0, utils_1.createUpdateWebhookByServiceId)(hookId, actions);
        return this.updateService(webhook);
    }
    async fetchAuthToken(email, password) {
        const { data } = await this.api
            .post('/login', {
            email,
            password,
        })
            .catch(createD2cError);
        return data?.member?.token ?? '';
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
    async updateService(webhook) {
        const { status } = await this.api.get(webhook).catch(createD2cError);
        return status;
    }
    async fetchHookIdByServiceId(serviceId) {
        const { data } = await this.api
            .get(`/v1/service/${serviceId}/hook`, {
            params: {
                generate: false,
            },
        })
            .catch(createD2cError);
        return data.result;
    }
    async fetchServiceIdByName(serviceName) {
        const services = await this.fetchAllServices();
        const serviceInfo = (0, utils_1.findServiceByName)(services, serviceName);
        if (!serviceInfo) {
            throw new Error(`Cannot find service - [${serviceName}]. This service does not exist.`);
        }
        return serviceInfo.id;
    }
    async fetchAllServices() {
        const { data } = await this.api
            .get('/v1/acc/entities')
            .catch(createD2cError);
        return data.result.services;
    }
}
exports.D2cApiClient = D2cApiClient;
const createD2cError = (e) => {
    throw new Error(`Request [${e.request?.path}] failed with status [${e.response?.status}].\n Response - [${e.response?.data}]`);
};
exports.createD2cError = createD2cError;
