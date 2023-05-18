import * as YAML from 'yaml';
import { readFile } from 'fs/promises';
import { DocsConfig, validateDocsConfig } from './validate-docs-config';
import { glob } from 'glob';
import { WikiJsApi } from './wiki-js-api';
import parseMD from 'parse-md';
import * as core from '@actions/core';

type SyncDocToWikiJsParams = {
  apiKey: string;
  baseUrl: string;
  docsConfigPath: string;
  dryRun?: boolean;
};

export async function syncDocsToWikiJs({
  apiKey,
  baseUrl,
  docsConfigPath,
  dryRun = false,
}: SyncDocToWikiJsParams) {
  const docsConfig = YAML.parse(
    await readFile(docsConfigPath, 'utf8'),
  ) as DocsConfig;

  validateDocsConfig(docsConfig);

  const wikiJsApi = new WikiJsApi(apiKey, baseUrl);

  // performing manual sync, to make sure that all files are up to date
  await wikiJsApi.syncFromGithub();

  // getting all files, to delete the ones that are not included in config
  const allFiles = await glob(['**/*'], {
    nodir: true,
    ignore: ['node_modules/**'],
  });

  const includeFiles = await glob(docsConfig.config.include, {
    nodir: true,
    ignore: docsConfig.config.ignore,
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

    const fileContents = await readFile(file, 'utf8');
    const { metadata } = parseMD(fileContents);
    const tags =
      (metadata as { tags?: string }).tags
        ?.split(',')
        .map((tag) => tag.trim()) ?? [];
    const wikiPage = await wikiJsApi.getPageByName(pathWithoutExt);

    if (dryRun) {
      core.info(
        `Dry run, skipping updating page ${wikiPage.path} with tags ${tags}`,
      );
      continue;
    }

    await wikiJsApi.updatePageWithTags(wikiPage.id, tags);
    core.info(`Page ${wikiPage.path} updated with tags ${tags}`);
  }
}
