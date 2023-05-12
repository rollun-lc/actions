import * as core from '@actions/core';
import { updateService } from './core';

const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e: any) {
    core.setFailed(e.message);
  }
};

const runAction = () => {
  run(async () =>
    updateService({
      serviceName: core.getInput('service-name'),
      configPath: core.getInput('config-path'),
      email: core.getInput('d2c-email'),
      password: core.getInput('d2c-password'),
      d2cBaseApiUrl: core.getInput('d2c-base-api-url'),
      commaSeparatedActions: core.getInput('actions'),
      smPassword: core.getInput('sm-password'),
      smUsername: core.getInput('sm-username'),
    }),
  );
};

runAction();
