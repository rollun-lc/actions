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
const promises_1 = require("fs/promises");
const replacer = (pathToJsonSummary, pathToReadme) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = promises_1.readFile(pathToJsonSummary, 'utf-8');
        const { total } = JSON.parse(yield summary);
        const readMe = yield promises_1.readFile(pathToReadme, 'utf-8');
        // if no code coverage badges were found, append new badges to readme file
        if (!/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g.test(readMe)) {
            appendNewBadges(total, pathToReadme);
            return;
        }
        fs_1.default.writeFileSync(pathToReadme, readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g, (match, name) => getCoverageBadge(name, total)), 'utf-8');
    }
    catch (e) {
        console.log(e);
    }
});
exports.replacer = replacer;
const getCoverageBadge = (name, total) => allCoverage(name, total);
const getBadge = (value, percentage) => `Coverage%20${value}-${percentage}%25-${getBadgeColor(percentage)}.svg`;
const getBadgeColor = (percentage) => percentage < 70 ? 'red' : percentage < 80 ? 'orange' : 'green';
const allCoverage = (name, total) => getBadge(name, total[name.toLowerCase()].pct);
const badgeTemplate = (value, percentage) => `![Coverage badge](https://img.shields.io/badge/${getBadge(value, percentage)})`;
const createBadges = (total) => Object.keys(total).map(key => badgeTemplate(key, total[key.toLowerCase()].pct)).join('\n');
const appendNewBadges = (total, pathToReadme) => fs_1.default.appendFileSync(pathToReadme, createBadges(total));
