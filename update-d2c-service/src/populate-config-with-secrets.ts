import { D2CServiceConfig } from './d2c-api/types';
import { resolveSecrets } from './get-secret-value';
import * as core from '@actions/core';

function isSecret(value: string | number) {
  return typeof value === 'string' && value.startsWith('sm://');
}

export async function populateConfigWithSecrets(
  config: D2CServiceConfig,
  auth: { username?: string; password?: string },
  smUrl = 'https://sm.rollun.net/openapi/RollunSecretManager/v1/secrets/resolve',
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
    core.info(`resolving secrets ${secretsNames.join(', ')}...`);
    const resolvedSecrets = await resolveSecrets(smUrl, secretsNames, auth as { username: string; password: string });
    core.info(`secrets resolved`);

    envs.forEach((env) => {
      if (!isSecret(env.value)) {
        return;
      }

      const secretName = env.value.replace('sm://', '');
      const secret = resolvedSecrets.find((secret) => secret.name === secretName)!;
      
      env.value = secret.value;
    });


    config['d2c-service-config'].env = envs;
    return config;
  } catch (e) {
    throw new Error('failed to fetch secrets: ' + (e as Error).message);
  }
}
