import { NodeRedApi } from './node-red-api';

type RefreshNodeRedModuleParams = {
  name: string;
  baseUrl: string;
};

export const refreshNodeRedModule = async ({
  name,
  baseUrl,
}: RefreshNodeRedModuleParams) => {
  const nodeRedApi = new NodeRedApi({ baseUrl });
  await nodeRedApi.refreshModule(name);
};
