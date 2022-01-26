import { JSONSummary, BadgeName, Percentage } from './types';
import fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';
import * as core from '@actions/core';

const git: SimpleGit = simpleGit();
const BADGE_REGEX = /Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g;

const replacer = async (
  pathToJsonSummary: string,
  pathToReadme: string,
  disableCommit: string,
) => {
  try {
    const toBePushed = disableCommit === 'false';

    const summary = fs.readFileSync(pathToJsonSummary, 'utf-8');
    const { total } = JSON.parse(summary);
    const readMe = fs.readFileSync(pathToReadme, 'utf-8');

    const updatedReadme = updateReadme(total, readMe);

    fs.writeFileSync(pathToReadme, updatedReadme, 'utf-8');
    if (toBePushed) {
      await git.addConfig('user.name', 'github-actions');
      await git.addConfig('user.email', 'github-actions@github.com');
      await git.fetch();
      await git.add(pathToReadme);
      await git.commit('Updated file with badges');
      await git.status();
      await git.push();
      console.log('pushed');
    }
  } catch (e) {
    throw e;
  }
};
// if no code coverage badges were found, append new badges to readme file
const updateReadme = (total: JSONSummary, readMe: string): string =>
  !BADGE_REGEX.test(readMe)
    ? prependNewBadges(total, readMe)
    : replaceOldBadges(total, readMe);
const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e) {
    core.setFailed(e.message);
  }
};

const prependNewBadges = (total: JSONSummary, pathToReadme: string) =>
  `${createBadges(total)}\n${fs.readFileSync(pathToReadme)}`;

const replaceOldBadges = (total: JSONSummary, readMe: string) =>
  readMe.replace(BADGE_REGEX, (match: string, name: BadgeName) =>
    getBadge(name, total[name.toLowerCase()].pct),
  );

const createBadges = (total: JSONSummary): string =>
  Object.keys(total)
    .map((key) => badgeTemplate(key as BadgeName, total[key.toLowerCase()].pct))
    .join('\n');

const badgeTemplate = (value: BadgeName, percentage: Percentage): string =>
  `![Coverage badge](https://img.shields.io/badge/${getBadge(
    value,
    percentage,
  )})`;

const getBadge = (value: BadgeName, percentage: Percentage): string =>
  `Coverage%20${value}-${percentage}%25-${getBadgeColor(percentage)}.svg`;

const getBadgeColor = (percentage: Percentage): string =>
  percentage < 70 ? 'red' : percentage < 80 ? 'orange' : 'green';

export { replacer, run };
