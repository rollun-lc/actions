import * as core from '@actions/core';
import { context } from '@actions/github';
import { updateService } from './core';

const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e: any) {
    core.setFailed(e.message);
  }
};

const runAction = () => {
  if (!context.ref.includes(context.payload.repository?.default_branch)) {
    console.log('This actions only runs on default branch branches');
    return;
  }

  run(async () =>
    updateService({
      serviceName: core.getInput('service-name'),
      email: core.getInput('d2c-email'),
      password: core.getInput('d2c-password'),
      d2cBaseApiUrl: core.getInput('d2c-base-api-url:'),
      commaSeparatedActions: core.getInput('actions'),
    }),
  );
};

runAction();
