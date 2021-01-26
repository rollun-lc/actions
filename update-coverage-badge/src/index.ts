import * as core  from '@actions/core'
import {replacer} from "./utils";

try {
  replacer(core.getInput('coverage-summary-path'), core.getInput('readme-path'));
} catch (error) {
  core.setFailed(error.message);
}
