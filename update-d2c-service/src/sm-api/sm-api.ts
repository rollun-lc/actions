import { D2CServiceConfig } from '../d2c-api/types';
import axios, { AxiosInstance } from 'axios';
import { In, Query } from 'rollun-ts-rql';

export class SmApi {
  private readonly api: AxiosInstance;

  constructor(
    private auth: { username: string; password: string },
    private baseUrl = 'https://rollun.net/api/datastore/Secrets',
  ) {
    this.api = axios.create({
      auth: {
        username: this.auth.username,
        password: this.auth.password,
      },
    });
  }

  async populateConfigWithSecrets(
    config: D2CServiceConfig,
  ): Promise<D2CServiceConfig> {
    const envs = config['d2c-service-config'].env || [];

    if (envs.length === 0) {
      return config;
    }

    const secretsNames = envs
      .filter((env) => env.value.startsWith('sm://'))
      .map((env) => env.value.replace('sm://', ''));

    const query = new Query().setQuery(new In('key', secretsNames));

    try {
      const { data: secrets } = await this.api.get<
        { key: string; value: string }[]
      >(`${this.baseUrl}?${query.toString()}`);

      const envsWithSecrets = envs.map((env) => {
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

      config['d2c-service-config'].env = envsWithSecrets;

      return config;
    } catch (e) {
      throw new Error('failed to fetch secrets: ' + (e as Error).message);
    }
  }
}
