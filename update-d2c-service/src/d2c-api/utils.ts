import { EntityService } from './types';
import { D2cApiClient } from './d2c-client-api';

const findServiceByName = (services: EntityService[], serviceName: string) => {
  return services.find(({ name }) => name === serviceName);
};

const createUpdateWebhookByServiceId = (hookId: string, actions: string) => {
  return `${D2cApiClient.baseUrl}hook/service/${hookId}?actions=${actions}`;
};

export { findServiceByName, createUpdateWebhookByServiceId };
