import { D2cApiClient } from './d2c-client-api';
declare type CreateD2cApiWithAuthOptions = {
    email: string;
    password: string;
    d2cBaseApiUrl: string;
};
declare const createD2cApiWithAuth: ({ email, password, d2cBaseApiUrl, }: CreateD2cApiWithAuthOptions) => Promise<D2cApiClient>;
export { createD2cApiWithAuth };
