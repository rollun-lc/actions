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
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateConfigWithSecrets = void 0;
const get_secret_value_1 = require("./get-secret-value");
const core = __importStar(require("@actions/core"));
function isSecret(value) {
    return typeof value === 'string' && value.startsWith('sm://');
}
async function populateConfigWithSecrets(config, auth, smUrl = 'https://sm.rollun.net/openapi/RollunSecretManager/v1/secrets/resolve') {
    const envs = config['d2c-service-config'].env || [];
    if (envs.length === 0) {
        return config;
    }
    const secretsNames = envs
        .filter((env) => isSecret(env.value))
        .map((env) => env.value.replace('sm://', ''));
    if (secretsNames.length === 0) {
        return config;
    }
    if (!auth.password || !auth.username) {
        throw new Error('smPassword and smUsername are required');
    }
    try {
        core.info(`resolving secrets ${secretsNames.join(', ')}...`);
        const resolvedSecrets = await (0, get_secret_value_1.resolveSecrets)(smUrl, secretsNames, auth);
        core.info(`secrets resolved`);
        envs.forEach((env) => {
            if (!isSecret(env.value)) {
                return;
            }
            const secretName = env.value.replace('sm://', '');
            const secret = resolvedSecrets.find((secret) => secret.name === secretName);
            env.value = secret.value;
        });
        config['d2c-service-config'].env = envs;
        return config;
    }
    catch (e) {
        throw new Error('failed to fetch secrets: ' + e.message);
    }
}
exports.populateConfigWithSecrets = populateConfigWithSecrets;
