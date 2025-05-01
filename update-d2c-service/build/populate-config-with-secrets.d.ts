import { D2CServiceConfig } from './d2c-api/types';
export declare function populateConfigWithSecrets(config: D2CServiceConfig, auth: {
    username?: string;
    password?: string;
}, smUrl?: string): Promise<D2CServiceConfig>;
