import {
  JSONSummary,
  BadgeName,
  Percentage
}                             from "./types";
import fs                     from "fs";
import simpleGit, {SimpleGit} from 'simple-git';
import * as core              from '@actions/core'

const git: SimpleGit            = simpleGit();
const DEFAULT_README_PATH       = './README.md'
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json'
const BADGE_REGEX               = /Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g

const replacer         = async (pathToJsonSummary: string, pathToReadme: string, disableCommit: string) => {
  try {
    const readmePath = pathToReadme || DEFAULT_README_PATH;
    const push       = !!disableCommit;
    console.log(disableCommit, typeof disableCommit);

    const summary = fs.readFileSync(pathToJsonSummary || DEFAULT_JSON_SUMMARY_PATH, 'utf-8');
    const {total} = JSON.parse(summary);
    const readMe  = fs.readFileSync(readmePath, 'utf-8');

    const updatedReadme = updateReadme(total, readMe);

    fs.writeFileSync(pathToReadme, updatedReadme, 'utf-8');
    if (push) {
      await git.addConfig('user.name', 'github-actions')
      await git.addConfig('user.email', 'github-actions@github.com')
      await git.fetch()
      await git.add(pathToReadme)
      await git.commit('Updated file with badges')
      await git.status()
      await git.push()
    }
  } catch (e) {
    throw e;
  }
}
// if no code coverage badges were found, append new badges to readme file
const updateReadme     = (total: JSONSummary, readMe: string): string =>
  !BADGE_REGEX.test(readMe) ?
    prependNewBadges(total, readMe) :
    replaceOldBadges(total, readMe)
const replaceOldBadges = (total: JSONSummary, readMe: string) => readMe.replace(BADGE_REGEX, (match: string, name: BadgeName) => getCoverageBadge(name, total))
const getCoverageBadge = (name: BadgeName, total: JSONSummary): string => allCoverage(name, total);
const getBadge         = (value: BadgeName, percentage: Percentage): string => `Coverage%20${value}-${percentage}%25-${getBadgeColor(percentage)}.svg`;
const getBadgeColor    = (percentage: Percentage): string => percentage < 70 ? 'red' : (percentage < 80 ? 'orange' : 'green');
const allCoverage      = (name: BadgeName, total: JSONSummary): string => getBadge(name, total[name.toLowerCase()].pct);
const badgeTemplate    = (value: BadgeName, percentage: Percentage): string => `![Coverage badge](https://img.shields.io/badge/${getBadge(value, percentage)})`;
const createBadges     = (total: JSONSummary): string => Object.keys(total).map(key => badgeTemplate(key as BadgeName, total[key.toLowerCase()].pct)).join('\n');
const prependNewBadges = (total: JSONSummary, pathToReadme: string) => `${createBadges(total)}\n${fs.readFileSync(pathToReadme)}`
const run              = async (exec: Function) => {
  try {
    await exec();
  } catch (e) {
    core.setFailed(e.message)
  }
}


export {
  replacer,
  run
}
