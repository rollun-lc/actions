import { AxiosError, AxiosInstance } from 'axios';
import { D2CServiceConfig, EntitiesResponse, EntityHost, EntityProject, EntityService } from './types';
declare type D2cApiClientOptions = {
    baseUrl: string;
};
declare class D2CBasicClient {
    protected api: AxiosInstance;
    constructor(options: D2cApiClientOptions);
    authenticate(email: string, password: string): Promise<void>;
    private setToken;
}
declare class D2cApiClient extends D2CBasicClient {
    entitiesCache: EntitiesResponse | null;
    fetchAllEntities(force?: boolean): Promise<EntitiesResponse>;
    getServiceInternalDomain(id: string): Promise<string>;
    fetchAllServices(force?: boolean): Promise<EntityService[]>;
    fetchAllProjects(force?: boolean): Promise<EntityProject[]>;
    fetchAllHosts(force?: boolean): Promise<EntityHost[]>;
    fetchServiceByName(serviceName: string, force?: boolean): Promise<EntityService | null>;
    fetchServiceById(serviceId: string, force?: boolean): Promise<EntityService | null>;
    fetchProjectByName(projectName: string, force?: boolean): Promise<EntityProject | null>;
    fetchHostByName(hostName: string, force?: boolean): Promise<EntityHost | null>;
    triggerServiceUpdate(serviceId: string, actions?: string): Promise<number>;
    awaitServiceAction(serviceId: string): Promise<void>;
    prepareServicePayload(type: string, config: D2CServiceConfig): Promise<Record<string, unknown>>;
    resolveEnvVars(env: D2CServiceConfig['d2c-service-config']['env']): Promise<{
        name: string;
        value: string;
    }[]>;
    updateService(config: D2CServiceConfig, service?: EntityService | null): Promise<void>;
}
declare const createD2cError: (e: AxiosError) => never;
export { D2cApiClient, createD2cError };
