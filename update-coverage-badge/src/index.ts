import * as core from '@actions/core'
import {
  replacer,
  run
}                from "./utils";


try {
  run(async () =>
    replacer(
      core.getInput('coverage-summary-path'),
      core.getInput('readme-path'),
      core.getInput('disable-commit')
    ));
} catch (error) {
  core.setFailed(error.message);
}
