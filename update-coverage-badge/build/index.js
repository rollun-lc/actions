"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __importDefault(require("@actions/core"));
var fs_1 = __importDefault(require("fs"));
var utils_1 = require("./utils");
var DEFAULT_README_PATH = './README.md';
var DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json';
try {
    var pathToReadme = core_1.default.getInput('README');
    var pathToJsonSummary = core_1.default.getInput('coverage-summary');
    if (pathToReadme.length === 0) {
        console.log('Path to README file was not provided, using the default path', DEFAULT_README_PATH);
        pathToReadme = DEFAULT_README_PATH;
    }
    if (pathToJsonSummary.length === 0) {
        console.log('Path to json summary was not provided, using the default path', DEFAULT_JSON_SUMMARY_PATH);
        pathToJsonSummary = DEFAULT_JSON_SUMMARY_PATH;
    }
    var total_1 = JSON.parse(fs_1.default.readFileSync(pathToJsonSummary, 'utf-8')).total;
    var readMe = fs_1.default.readFileSync(pathToReadme, 'utf-8');
    fs_1.default.writeFileSync(pathToReadme, readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g, function (match, name) { return utils_1.replacer(name, total_1); }), 'utf-8');
}
catch (error) {
    core_1.default.setFailed(error.message);
}
