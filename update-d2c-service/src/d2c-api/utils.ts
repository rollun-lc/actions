import { EntityService } from './types';

const findServiceByName = (services: EntityService[], serviceName: string) => {
  return services.find(({ name }) => name === serviceName);
};

const createUpdateWebhookByServiceId = (hookId: string, actions: string) => {
  return `/hook/service/${hookId}?actions=${actions}`;
};

export { findServiceByName, createUpdateWebhookByServiceId };
