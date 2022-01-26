import { createD2cApiWithAuth } from './d2c-api/create-d2c-api-with-auth';
import { validateActions } from './utils';

type UpdateServiceParams = {
  serviceName: string;
  email: string;
  password: string;
  commaSeparatedActions: string;
};

const updateService = async ({
  serviceName,
  email,
  commaSeparatedActions,
  password,
}: UpdateServiceParams) => {
  validateActions(commaSeparatedActions);
  const d2cApi = await createD2cApiWithAuth(email, password);
  const updateHook = await d2cApi.fetchUpdateServiceWebhook(
    serviceName,
    commaSeparatedActions,
  );

  console.log(updateHook);
};

export { updateService };
