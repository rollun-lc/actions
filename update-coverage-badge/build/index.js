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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const DEFAULT_README_PATH = './README.md';
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json';
try {
    let pathToReadme = core.getInput('README');
    let pathToJsonSummary = core.getInput('coverage-summary');
    if (pathToReadme.length === 0) {
        console.log('Path to README file was not provided, using the default path', DEFAULT_README_PATH);
        pathToReadme = DEFAULT_README_PATH;
    }
    if (pathToJsonSummary.length === 0) {
        console.log('Path to json summary was not provided, using the default path', DEFAULT_JSON_SUMMARY_PATH);
        pathToJsonSummary = DEFAULT_JSON_SUMMARY_PATH;
    }
    const { total } = JSON.parse(fs_1.default.readFileSync(pathToJsonSummary, 'utf-8'));
    const readMe = fs_1.default.readFileSync(pathToReadme, 'utf-8');
    fs_1.default.writeFileSync(pathToReadme, readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g, (match, name) => utils_1.replacer(name, total)), 'utf-8');
}
catch (error) {
    core.setFailed(error.message);
}
