import * as core            from '@actions/core'
import fs                   from 'fs'
import {replacer}           from "./utils";
import {PossibleBadgeNames} from "./types";

const DEFAULT_README_PATH       = './README.md'
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json'

try {
  let pathToReadme      = core.getInput('README');
  let pathToJsonSummary = core.getInput('coverage-summary');

  if (pathToReadme.length === 0) {
    console.log('Path to README file was not provided, using the default path', DEFAULT_README_PATH)
    pathToReadme = DEFAULT_README_PATH;
  }
  if (pathToJsonSummary.length === 0) {
    console.log('Path to json summary was not provided, using the default path', DEFAULT_JSON_SUMMARY_PATH)
    pathToJsonSummary = DEFAULT_JSON_SUMMARY_PATH;
  }

  const {total} = JSON.parse(fs.readFileSync(pathToJsonSummary, 'utf-8'));
  const readMe  = fs.readFileSync(pathToReadme, 'utf-8');
  fs.writeFileSync(
    pathToReadme,
    readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g,
      (match: string, name: PossibleBadgeNames) => replacer(name, total)),
    'utf-8');
} catch (error) {
  core.setFailed(error.message);
}
