import { AxiosError } from 'axios';
declare class D2cApiClient {
    private api;
    static baseUrl: string;
    constructor();
    fetchUpdateServiceWebhook(serviceName: string, actions: string): Promise<string>;
    fetchAuthToken(email: string, password: string): Promise<string>;
    setToken(token: string): void;
    private fetchHookIdByServiceId;
    private fetchServiceIdByName;
    private fetchAllServices;
}
declare const createD2cError: (e: AxiosError) => never;
export { D2cApiClient, createD2cError };
