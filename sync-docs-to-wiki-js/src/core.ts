import * as YAML from 'yaml';
import { readFile } from 'fs/promises';
import { DocsConfig, validateDocsConfig } from './validate-docs-config';
import { glob } from 'glob';
import { WikiJsApi } from './wiki-js-api';
import parseMD from 'parse-md';
import * as core from '@actions/core';
import { validateMdFileMetadata } from './validate-md-file-metadata';

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
    const { metadata, content } = parseMD(fileContents);

    const wikiPage = await wikiJsApi.getPageByNameSafe(pathWithoutExt);

    validateMdFileMetadata(metadata);

    const tags = metadata.tags?.split(',').map((tag) => tag.trim()) ?? [];

    const updateOrCreatePage = {
      content,
      description: metadata.description ?? '',
      isPrivate: metadata.isPrivate ?? false,
      isPublished: metadata.isPublished ?? true,
      locale: metadata.locale ?? 'en',
      path: metadata.path ?? pathWithoutExt,
      tags,
      title: metadata.title ?? pathWithoutExt,
    };

    if (!wikiPage) {
      core.info(`Page ${pathWithoutExt} does not exist, creating`);
      if (dryRun) {
        core.info(`Dry run, skipping creating page ${pathWithoutExt}`);
        continue;
      }

      await wikiJsApi.createPage(updateOrCreatePage);
      core.info(`Page ${pathWithoutExt} created`);
      continue;
    }

    if (dryRun) {
      core.info(
        `Dry run, skipping updating page ${wikiPage.path} with tags ${tags}`,
      );
      continue;
    }

    await wikiJsApi.updatePageWithTags(wikiPage.id, updateOrCreatePage);
    core.info(`Page ${wikiPage.path} updated with tags ${tags}`);
  }
}
