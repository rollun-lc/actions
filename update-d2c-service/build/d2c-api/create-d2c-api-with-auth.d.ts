import { D2cApiClient } from './d2c-client-api';
declare const createD2cApiWithAuth: (email: string, password: string) => Promise<D2cApiClient>;
export { createD2cApiWithAuth };
