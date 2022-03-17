import { createD2cApiWithAuth } from './d2c-api/create-d2c-api-with-auth';
import { validateActions } from './utils';

type UpdateServiceParams = {
  serviceName: string;
  email: string;
  password: string;
  commaSeparatedActions: string;
  d2cBaseApiUrl: string;
};

const updateService = async ({
  serviceName,
  email,
  commaSeparatedActions,
  password,
  d2cBaseApiUrl,
}: UpdateServiceParams) => {
  validateActions(commaSeparatedActions);
  const d2cApi = await createD2cApiWithAuth({ email, password, d2cBaseApiUrl });
  await d2cApi.updateServiceByServiceName(serviceName, commaSeparatedActions);
};

export { updateService };
