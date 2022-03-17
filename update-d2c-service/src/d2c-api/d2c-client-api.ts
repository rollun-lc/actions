import axios, { AxiosError, AxiosInstance } from 'axios';
import { EntitiesResponse, GenerateHookResponse, LoginResponse } from './types';
import { createUpdateWebhookByServiceId, findServiceByName } from './utils';

type D2cApiClientOptions = {
  baseUrl: string;
};

class D2cApiClient {
  private api: AxiosInstance;

  constructor(options: D2cApiClientOptions) {
    this.api = axios.create({
      baseURL: options.baseUrl,
    });
  }

  public async updateServiceByServiceName(
    serviceName: string,
    actions: string,
  ) {
    const serviceId = await this.fetchServiceIdByName(serviceName);
    const hookId = await this.fetchHookIdByServiceId(serviceId);

    if (!hookId) {
      throw new Error(
        `Could not find hook id by service - [${serviceName}] with id - [${serviceId}]`,
      );
    }

    const webhook = createUpdateWebhookByServiceId(hookId, actions);
    return this.updateService(webhook);
  }

  public async fetchAuthToken(email: string, password: string) {
    const { data } = await this.api
      .post<LoginResponse>('/login', {
        email,
        password,
      })
      .catch(createD2cError);

    return data?.member?.token ?? '';
  }

  public setToken(token: string) {
    this.api.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    }));
  }

  private async updateService(webhook: string) {
    const { status } = await this.api.get(webhook).catch(createD2cError);

    return status;
  }

  private async fetchHookIdByServiceId(serviceId: string) {
    const { data } = await this.api
      .get<GenerateHookResponse>(`/v1/service/${serviceId}/hook`, {
        params: {
          generate: false,
        },
      })
      .catch(createD2cError);

    return data.result;
  }

  private async fetchServiceIdByName(serviceName: string) {
    const services = await this.fetchAllServices();
    const serviceInfo = findServiceByName(services, serviceName);

    if (!serviceInfo) {
      throw new Error(
        `Cannot find service - [${serviceName}]. This service does not exist.`,
      );
    }

    return serviceInfo.id;
  }

  private async fetchAllServices() {
    const { data } = await this.api
      .get<EntitiesResponse>('/v1/acc/entities')
      .catch(createD2cError);
    return data.result.services;
  }
}

const createD2cError = (e: AxiosError) => {
  throw new Error(
    `Request [${e.request?.path}] failed with status [${e.response?.status}].\n Response - [${e.response?.data}]`,
  );
};

export { D2cApiClient, createD2cError };
