"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateConfigWithSecrets = void 0;
const get_secret_value_1 = require("./get-secret-value");
async function populateConfigWithSecrets(config, auth, baseUrl = 'https://rollun.net/api/openapi/RollunSecretManager/v1/secrets/') {
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
    try {
        const envs = [];
        for (const env of config['d2c-service-config'].env || []) {
            if (!env.value.startsWith('sm://')) {
                envs.push(env);
                continue;
            }
            const secretValue = await (0, get_secret_value_1.getSecretValue)(env.value.replace('sm://', ''), baseUrl, auth);
            envs.push({
                ...env,
                value: secretValue,
            });
        }
        config['d2c-service-config'].env = envs;
        return config;
    }
    catch (e) {
        throw new Error('failed to fetch secrets: ' + e.message);
    }
}
exports.populateConfigWithSecrets = populateConfigWithSecrets;
