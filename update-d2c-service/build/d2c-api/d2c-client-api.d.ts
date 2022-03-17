import { AxiosError } from 'axios';
declare type D2cApiClientOptions = {
    baseUrl: string;
};
declare class D2cApiClient {
    private api;
    constructor(options: D2cApiClientOptions);
    updateServiceByServiceName(serviceName: string, actions: string): Promise<number>;
    fetchAuthToken(email: string, password: string): Promise<string>;
    setToken(token: string): void;
    private updateService;
    private fetchHookIdByServiceId;
    private fetchServiceIdByName;
    private fetchAllServices;
}
declare const createD2cError: (e: AxiosError) => never;
export { D2cApiClient, createD2cError };
