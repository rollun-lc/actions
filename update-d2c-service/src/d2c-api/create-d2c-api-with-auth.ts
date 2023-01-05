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

  await d2cClient.authenticate(email, password);

  return d2cClient;
};

export { createD2cApiWithAuth };
