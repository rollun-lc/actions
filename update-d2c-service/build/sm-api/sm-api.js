"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmApi = void 0;
const axios_1 = __importDefault(require("axios"));
const rollun_ts_rql_1 = require("rollun-ts-rql");
class SmApi {
    auth;
    baseUrl;
    api;
    constructor(auth, baseUrl = 'https://rollun.net/api/datastore/Secrets') {
        this.auth = auth;
        this.baseUrl = baseUrl;
        this.api = axios_1.default.create({
            auth: {
                username: this.auth.username,
                password: this.auth.password,
            },
        });
    }
    async populateConfigWithSecrets(config) {
        const envs = config['d2c-service-config'].env || [];
        if (envs.length === 0) {
            return config;
        }
        const secretsNames = envs
            .filter((env) => env.value.startsWith('sm://'))
            .map((env) => env.value.replace('sm://', ''));
        const query = new rollun_ts_rql_1.Query().setQuery(new rollun_ts_rql_1.In('key', secretsNames));
        try {
            const { data: secrets } = await this.api.get(`${this.baseUrl}?${query.toString()}`);
            const envsWithSecrets = envs.map((env) => {
                if (!env.value.startsWith('sm://')) {
                    return env;
                }
                const secret = secrets.find((s) => s.key === env.value.replace('sm://', ''));
                if (!secret) {
                    throw new Error(`Secret ${env.value} not found`);
                }
                return {
                    ...env,
                    value: secret.value,
                };
            });
            config['d2c-service-config'].env = envsWithSecrets;
            return config;
        }
        catch (e) {
            throw new Error('failed to fetch secrets: ' + e.message);
        }
    }
}
exports.SmApi = SmApi;
