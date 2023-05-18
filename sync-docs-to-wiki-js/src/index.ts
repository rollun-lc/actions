import * as core from '@actions/core';
import { syncDocsToWikiJs } from './core';

const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e: any) {
    core.setFailed(e.message);
  }
};

const runAction = () => {
  run(async () =>
    syncDocsToWikiJs({
      apiKey: core.getInput('api-key'),
      baseUrl: core.getInput('wiki-js-graphql-url'),
      docsConfigPath: core.getInput('docs-config-path'),
      dryRun: core.getInput('dry-run') === 'true',
    }),
  );
};

runAction();
