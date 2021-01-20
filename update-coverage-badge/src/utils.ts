import {
  JSONSummary,
  BadgeName,
  Percentage
}                 from "./types";
import fs         from "fs";
import {readFile} from 'fs/promises'

const replacer         = async (pathToJsonSummary: string, pathToReadme: string) => {
  try {
    const summary = readFile(pathToJsonSummary, 'utf-8');
    const {total} = JSON.parse(await summary);
    const readMe  = await readFile(pathToReadme, 'utf-8');

    // if no code coverage badges were found, append new badges to readme file
    if (!/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g.test(readMe)) {
      appendNewBadges(total, pathToReadme);
      return;
    }

    fs.writeFileSync(
      pathToReadme,
      readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g,
        (match: string, name: BadgeName) => getCoverageBadge(name, total)),
      'utf-8');
  } catch (e) {
    console.log(e);
  }
}
const getCoverageBadge = (name: BadgeName, total: JSONSummary): string => allCoverage(name, total);
const getBadge         = (value: BadgeName, percentage: Percentage): string => `Coverage%20${value}-${percentage}%25-${getBadgeColor(percentage)}.svg`;
const getBadgeColor    = (percentage: Percentage): string => percentage < 70 ? 'red' : percentage < 80 ? 'orange' : 'green';
const allCoverage      = (name: BadgeName, total: JSONSummary): string => getBadge(name, total[name.toLowerCase()].pct);
const badgeTemplate    = (value: BadgeName, percentage: Percentage): string => `![Coverage badge](https://img.shields.io/badge/${getBadge(value, percentage)})`;
const createBadges     = (total: JSONSummary): string => Object.keys(total).map(key => badgeTemplate(key as BadgeName, total[key.toLowerCase()].pct)).join('\n');
const appendNewBadges  = (total: JSONSummary, pathToReadme: string) => fs.appendFileSync(pathToReadme, createBadges(total));

export {
  replacer
}
