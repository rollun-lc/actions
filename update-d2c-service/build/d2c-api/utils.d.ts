import { EntityService } from './types';
declare const findServiceByName: (services: EntityService[], serviceName: string) => EntityService | undefined;
declare const createUpdateWebhookByServiceId: (hookId: string, actions: string) => string;
export { findServiceByName, createUpdateWebhookByServiceId };
