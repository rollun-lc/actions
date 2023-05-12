import { D2CServiceConfig } from '../d2c-api/types';
export declare class SmApi {
    private auth;
    private baseUrl;
    private readonly api;
    constructor(auth: {
        username: string;
        password: string;
    }, baseUrl?: string);
    populateConfigWithSecrets(config: D2CServiceConfig): Promise<D2CServiceConfig>;
}
