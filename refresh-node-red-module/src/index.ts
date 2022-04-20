import * as core from '@actions/core';
import { refreshNodeRedModule } from './core';

const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e: any) {
    core.setFailed(e.message);
  }
};

const runAction = () => {
  run(async () =>
    refreshNodeRedModule({
      name: core.getInput('name'),
      baseUrl: core.getInput('node-red-url'),
    }),
  );
};

runAction();
