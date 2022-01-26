import * as core from '@actions/core';
import { replacer, run } from './utils';
import { context } from '@actions/github';

const runAction = () => {
  if (!context.ref.includes(context.payload.repository?.default_branch)) {
    console.log('This actions only runs on default branch branches');
    return;
  }

  run(async () =>
    replacer(
      core.getInput('coverage-summary-path'),
      core.getInput('readme-path'),
      core.getInput('disable-commit'),
    ),
  );
};

try {
  runAction();
} catch (error) {
  core.setFailed(error.message);
}
