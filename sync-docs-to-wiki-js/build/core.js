"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.syncDocsToWikiJs = void 0;
const YAML = __importStar(require("yaml"));
const promises_1 = require("fs/promises");
const validate_docs_config_1 = require("./validate-docs-config");
const glob_1 = require("glob");
const wiki_js_api_1 = require("./wiki-js-api");
const parse_md_1 = __importDefault(require("parse-md"));
const core = __importStar(require("@actions/core"));
async function syncDocsToWikiJs({ apiKey, baseUrl, docsConfigPath, dryRun = false, }) {
    const docsConfig = YAML.parse(await (0, promises_1.readFile)(docsConfigPath, 'utf8'));
    (0, validate_docs_config_1.validateDocsConfig)(docsConfig);
    const wikiJsApi = new wiki_js_api_1.WikiJsApi(apiKey, baseUrl);
    // performing manual sync, to make sure that all files are up to date
    await wikiJsApi.syncFromGithub();
    // getting all files, to delete the ones that are not included in config
    const allFiles = await (0, glob_1.glob)(['**/*'], {
        nodir: true,
        ignore: ['node_modules/**'],
    });
    const includeFiles = await (0, glob_1.glob)(['docs/test/**', 'README.md'], {
        nodir: true,
    });
    for (const file of allFiles) {
        const pathWithoutExt = file.replace('.md', '');
        core.info(`Processing file ${file}`);
        if (!includeFiles.includes(file)) {
            core.info(`File ${file} is not included in config, deleting`);
            if (!dryRun) {
                await wikiJsApi.tryDeletePage(pathWithoutExt);
            }
            continue;
        }
        const fileContents = await (0, promises_1.readFile)(file, 'utf8');
        const { metadata } = (0, parse_md_1.default)(fileContents);
        const tags = metadata.tags
            ?.split(',')
            .map((tag) => tag.trim()) ?? [];
        const wikiPage = await wikiJsApi.getPageByName(pathWithoutExt);
        if (dryRun) {
            core.info(`Dry run, skipping updating page ${wikiPage.path} with tags ${tags}`);
            continue;
        }
        await wikiJsApi.updatePageWithTags(wikiPage.id, tags);
        core.info(`Page ${wikiPage.path} updated with tags ${tags}`);
    }
}
exports.syncDocsToWikiJs = syncDocsToWikiJs;
