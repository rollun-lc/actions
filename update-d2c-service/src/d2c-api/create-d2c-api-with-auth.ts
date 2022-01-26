import { D2cApiClient } from './d2c-client-api';

const createD2cApiWithAuth = async (email: string, password: string) => {
  const d2cClient = new D2cApiClient();
  const token = await d2cClient.fetchAuthToken(email, password);

  d2cClient.setToken(token);

  return d2cClient;
};

export { createD2cApiWithAuth };
