"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacer = void 0;
const fs_1 = __importDefault(require("fs"));
const simple_git_1 = __importDefault(require("simple-git"));
const child_process_1 = require("child_process");
const git = simple_git_1.default();
const DEFAULT_README_PATH = './README.md';
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json';
const BADGE_REGEX = /Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g;
const replacer = (pathToJsonSummary, pathToReadme, disableCommit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const readmePath = pathToReadme || DEFAULT_README_PATH;
        const summary = fs_1.default.readFileSync(pathToJsonSummary || DEFAULT_JSON_SUMMARY_PATH, 'utf-8');
        const { total } = JSON.parse(summary);
        const readMe = fs_1.default.readFileSync(readmePath, 'utf-8');
        const updatedReadme = updateReadme(total, readMe);
        fs_1.default.writeFileSync(pathToReadme, updatedReadme, 'utf-8');
        console.log(disableCommit);
        if (disableCommit === 'false') {
            child_process_1.exec('git config user.name github-actions');
            child_process_1.exec('git config user.name github-actions');
            child_process_1.exec('git add ./README.md');
            child_process_1.exec('git commit -m "generated README.md file"');
            child_process_1.exec('git push');
            // console.log(await git.addConfig('user.name', 'github-actions'))
            // console.log(await git.addConfig('user.email', 'github-actions@github.com'))
            // console.log(await git.fetch())
            // console.log(await git.add(pathToReadme));
            // console.log(await git.commit('Updated file with badges'));
            // console.log(await git.push());
        }
    }
    catch (e) {
        throw new Error(e);
    }
});
exports.replacer = replacer;
// if no code coverage badges were found, append new badges to readme file
const updateReadme = (total, readMe) => !BADGE_REGEX.test(readMe) ?
    prependNewBadges(total, readMe) :
    replaceOldBadges(total, readMe);
const replaceOldBadges = (total, readMe) => readMe.replace(BADGE_REGEX, (match, name) => getCoverageBadge(name, total));
const getCoverageBadge = (name, total) => allCoverage(name, total);
const getBadge = (value, percentage) => `Coverage%20${value}-${percentage}%25-${getBadgeColor(percentage)}.svg`;
const getBadgeColor = (percentage) => percentage < 70 ? 'red' : (percentage < 80 ? 'orange' : 'green');
const allCoverage = (name, total) => getBadge(name, total[name.toLowerCase()].pct);
const badgeTemplate = (value, percentage) => `![Coverage badge](https://img.shields.io/badge/${getBadge(value, percentage)})`;
const createBadges = (total) => Object.keys(total).map(key => badgeTemplate(key, total[key.toLowerCase()].pct)).join('\n');
const prependNewBadges = (total, pathToReadme) => `${createBadges(total)}\n${fs_1.default.readFileSync(pathToReadme)}`;
