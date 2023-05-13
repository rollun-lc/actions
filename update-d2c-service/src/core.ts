import { createD2cApiWithAuth } from './d2c-api/create-d2c-api-with-auth';
import { validateActions } from './utils';
import * as YAML from 'yaml';
import fs from 'fs';
import { validateConfig } from './validate-config';
import { populateConfigWithSecrets } from './populate-config-with-secrets';

type UpdateServiceParams = {
  serviceName: string;
  configPath?: string;
  email: string;
  password: string;
  commaSeparatedActions: string;
  d2cBaseApiUrl: string;
  smUsername?: string;
  smPassword?: string;
};

const updateService = async ({
  serviceName,
  configPath,
  email,
  commaSeparatedActions,
  password,
  d2cBaseApiUrl,
  smUsername,
  smPassword,
}: UpdateServiceParams) => {
  validateActions(commaSeparatedActions);

  // fallback to serviceName, if no config provided
  const config = configPath
    ? YAML.parse(fs.readFileSync(configPath, 'utf8'))
    : { 'd2c-service-config': { name: serviceName } };

  const d2cApi = await createD2cApiWithAuth({ email, password, d2cBaseApiUrl });
  const service = await d2cApi.fetchServiceByName(
    config['d2c-service-config'].name,
  );

  // if service exists, but no config provided, just use old flow, and trigger update hook.
  if (service && !configPath) {
    await d2cApi.triggerServiceUpdate(service.id, commaSeparatedActions);
    return;
  }

  if (!configPath) {
    throw new Error(
      'configPath is required, if service does not exist. provide your config in configPath, to autocreate/update service',
    );
  }

  if (!validateConfig(config)) {
    throw new Error('config is not valid, see messages above');
  }

  if (!smPassword || !smUsername) {
    throw new Error('smPassword and smUsername are required');
  }

  const configWithSecretValues = await populateConfigWithSecrets(config, {
    username: smUsername,
    password: smPassword,
  });

  await d2cApi.updateService(config, service);
};

export { updateService };
