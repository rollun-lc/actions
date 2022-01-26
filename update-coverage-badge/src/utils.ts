import { JSONSummary, BadgeName, Percentage } from './types';
import { readFile, writeFile } from 'fs/promises';
import simpleGit, { SimpleGit } from 'simple-git';
import * as core from '@actions/core';

const git: SimpleGit = simpleGit();
const BADGE_REGEX = /Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g;

const replacer = async (
  pathToJsonSummary: string,
  pathToReadme: string,
  disableCommit: string,
) => {
  if (!pathToJsonSummary || !pathToReadme) {
    throw new Error(
      'Invalid arguments. Either [pathToReadme] or [pathToJsonSummary] is empty',
    );
  }

  const toBePushed = disableCommit === 'false';

  const summary = await readFile(pathToJsonSummary, 'utf-8');
  const { total } = JSON.parse(summary);
  const readMe = await readFile(pathToReadme, 'utf-8');

  const updatedReadme = await updateReadme(total, readMe);

  await writeFile(pathToReadme, updatedReadme, 'utf-8');
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
};
// if no code coverage badges were found, append new badges to readme file
const updateReadme = async (
  total: JSONSummary,
  readMe: string,
): Promise<string> =>
  !BADGE_REGEX.test(readMe)
    ? await prependNewBadges(total, readMe)
    : replaceOldBadges(total, readMe);
const run = async (exec: Function) => {
  try {
    await exec();
  } catch (e) {
    core.setFailed(e.message);
  }
};

const prependNewBadges = async (total: JSONSummary, pathToReadme: string) =>
  `${createBadges(total)}\n${await readFile(pathToReadme)}`;

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
