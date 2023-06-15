"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateConfigWithSecrets = void 0;
function isSecret(value) {
    return typeof value === 'string' && value.startsWith('sm://');
}
async function populateConfigWithSecrets(config, auth, baseUrl = 'https://rollun.net/api/openapi/RollunSecretManager/v1/secrets/') {
    return config;
    // const envs = config['d2c-service-config'].env || [];
    //
    // if (envs.length === 0) {
    //   return config;
    // }
    //
    // const secretsNames = envs
    //   .filter((env) => isSecret(env.value))
    //   .map((env) => env.value.replace('sm://', ''));
    //
    // if (secretsNames.length === 0) {
    //   return config;
    // }
    //
    // if (!auth.password || !auth.username) {
    //   throw new Error('smPassword and smUsername are required');
    // }
    try {
        //   const resultEnvs: { name: string; value: string }[] = [];
        //
        //   for (const env of config['d2c-service-config'].env || []) {
        //     if (!isSecret(env.value)) {
        //       envs.push(env);
        //       continue;
        //     }
        //
        //     const secretValue = await getSecretValue(
        //       env.value.replace('sm://', ''),
        //       baseUrl,
        //       auth,
        //     );
        //
        //     resultEnvs.push({
        //       ...env,
        //       value: secretValue,
        //     });
        //   }
        //
        //   config['d2c-service-config'].env = resultEnvs;
        //   return config;
    }
    catch (e) {
        throw new Error('failed to fetch secrets: ' + e.message);
    }
}
exports.populateConfigWithSecrets = populateConfigWithSecrets;
