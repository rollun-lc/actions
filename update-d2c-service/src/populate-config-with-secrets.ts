import { D2CServiceConfig } from './d2c-api/types';
import { getSecretValue } from './get-secret-value';

export async function populateConfigWithSecrets(
  config: D2CServiceConfig,
  auth: { username?: string; password?: string },
  baseUrl = 'https://rollun.net/api/openapi/RollunSecretManager/v1/secrets/',
) {
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
    const envs: { name: string; value: string }[] = [];

    for (const env of config['d2c-service-config'].env || []) {
      if (!env.value.startsWith('sm://')) {
        return envs.push(env);
      }

      const secretValue = await getSecretValue(
        env.value.replace('sm://', ''),
        baseUrl,
        auth,
      );

      envs.push({
        ...env,
        value: secretValue,
      });
    }

    config['d2c-service-config'].env = envs;
    return config;
  } catch (e) {
    throw new Error('failed to fetch secrets: ' + (e as Error).message);
  }
}
