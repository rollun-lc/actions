import * as core from '@actions/core'
import {
  replacer,
  run
}                from "./utils";
import {context} from '@actions/github'


try {
  console.log(context);

  run(async () => replacer(
    core.getInput('coverage-summary-path'),
    core.getInput('readme-path'),
    core.getInput('disable-commit')))
} catch (error) {
  core.setFailed(error.message);
}
