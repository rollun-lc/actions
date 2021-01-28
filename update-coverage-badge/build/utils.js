"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.run = exports.replacer = void 0;
const fs_1 = __importDefault(require("fs"));
const simple_git_1 = __importDefault(require("simple-git"));
const core = __importStar(require("@actions/core"));
const git = simple_git_1.default();
const BADGE_REGEX = /Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g;
const replacer = (pathToJsonSummary, pathToReadme, disableCommit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const toBePushed = disableCommit === 'false';
        const summary = fs_1.default.readFileSync(pathToJsonSummary, 'utf-8');
        const { total } = JSON.parse(summary);
        const readMe = fs_1.default.readFileSync(pathToReadme, 'utf-8');
        const updatedReadme = updateReadme(total, readMe);
        fs_1.default.writeFileSync(pathToReadme, updatedReadme, 'utf-8');
        if (toBePushed) {
            yield git.addConfig('user.name', 'github-actions');
            yield git.addConfig('user.email', 'github-actions@github.com');
            yield git.fetch();
            yield git.add(pathToReadme);
            yield git.commit('Updated file with badges');
            yield git.status();
            yield git.push();
            console.log('pushed');
        }
    }
    catch (e) {
        throw e;
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
const run = (exec) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exec();
    }
    catch (e) {
        core.setFailed(e.message);
    }
});
exports.run = run;
