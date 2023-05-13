import { D2CServiceConfig } from './d2c-api/types';
import { In, Query } from 'rollun-ts-rql';
import axios from 'axios';

export async function populateConfigWithSecrets(
  config: D2CServiceConfig,
  auth: { username?: string; password?: string },
  baseUrl = 'https://rollun.net/api/datastore/Secrets',
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

  const query = new Query().setQuery(new In('key', secretsNames));

  try {
    const { data: secrets } = await axios.get<{ key: string; value: string }[]>(
      `${baseUrl}?${query.toString()}`,
      {
        auth: auth as { username: string; password: string },
      },
    );

    config['d2c-service-config'].env = envs.map((env) => {
      if (!env.value.startsWith('sm://')) {
        return env;
      }

      const secret = secrets.find(
        (s) => s.key === env.value.replace('sm://', ''),
      );

      if (!secret) {
        throw new Error(`Secret ${env.value} not found`);
      }

      return {
        ...env,
        value: secret.value,
      };
    });

    return config;
  } catch (e) {
    throw new Error('failed to fetch secrets: ' + (e as Error).message);
  }
}
