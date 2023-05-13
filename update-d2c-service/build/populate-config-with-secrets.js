"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateConfigWithSecrets = void 0;
const rollun_ts_rql_1 = require("rollun-ts-rql");
const axios_1 = __importDefault(require("axios"));
async function populateConfigWithSecrets(config, auth, baseUrl = 'https://rollun.net/api/datastore/Secrets') {
    const envs = config['d2c-service-config'].env || [];
    if (envs.length === 0) {
        return config;
    }
    const secretsNames = envs
        .filter((env) => env.value.startsWith('sm://'))
        .map((env) => env.value.replace('sm://', ''));
    if (secretsNames.length === 0) {
        return config;
    }
    if (!auth.password || !auth.username) {
        throw new Error('smPassword and smUsername are required');
    }
    const query = new rollun_ts_rql_1.Query().setQuery(new rollun_ts_rql_1.In('key', secretsNames));
    try {
        const { data: secrets } = await axios_1.default.get(`${baseUrl}?${query.toString()}`, {
            auth: auth,
        });
        config['d2c-service-config'].env = envs.map((env) => {
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
        return config;
    }
    catch (e) {
        throw new Error('failed to fetch secrets: ' + e.message);
    }
}
exports.populateConfigWithSecrets = populateConfigWithSecrets;
