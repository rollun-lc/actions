import { D2CServiceConfig } from './d2c-api/types';
import { getSecretValue } from './get-secret-value';
import * as core from '@actions/core';

function isSecret(value: string | number) {
  return typeof value === 'string' && value.startsWith('sm://');
}

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
    .filter((env) => isSecret(env.value))
    .map((env) => env.value.replace('sm://', ''));

  if (secretsNames.length === 0) {
    return config;
  }

  if (!auth.password || !auth.username) {
    throw new Error('smPassword and smUsername are required');
  }

  try {
    const resultEnvs: { name: string; value: string }[] = [];

    for (const env of config['d2c-service-config'].env || []) {
      if (!isSecret(env.value)) {
        resultEnvs.push(env);
        continue;
      }

      core.info(`resolving secret ${env.value}...`);

      const secretValue = await getSecretValue(
        env.value.replace('sm://', ''),
        baseUrl,
        auth,
      );

      resultEnvs.push({
        ...env,
        value: secretValue,
      });

      core.info(`secret ${env.value} was correctly resolved.`);
    }

    config['d2c-service-config'].env = resultEnvs;
    return config;
  } catch (e) {
    throw new Error('failed to fetch secrets: ' + (e as Error).message);
  }
}
