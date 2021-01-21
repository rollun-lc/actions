import * as core            from '@actions/core'
import {replacer}  from "./utils";

const DEFAULT_README_PATH       = './README.md'
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json'

try {
  let pathToReadme      = core.getInput('readme-path') || DEFAULT_README_PATH;
  let pathToJsonSummary = core.getInput('coverage-summary-path') || DEFAULT_JSON_SUMMARY_PATH;

  replacer(pathToJsonSummary, pathToReadme);
} catch (error) {
  core.setFailed(error.message);
}
