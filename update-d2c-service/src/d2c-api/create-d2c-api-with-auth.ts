import { D2cApiClient } from './d2c-client-api';

type CreateD2cApiWithAuthOptions = {
  email: string;
  password: string;
  d2cBaseApiUrl: string;
};

const createD2cApiWithAuth = async ({
  email,
  password,
  d2cBaseApiUrl,
}: CreateD2cApiWithAuthOptions) => {
  const d2cClient = new D2cApiClient({ baseUrl: d2cBaseApiUrl });
  const token = await d2cClient.fetchAuthToken(email, password);

  d2cClient.setToken(token);

  return d2cClient;
};

export { createD2cApiWithAuth };
