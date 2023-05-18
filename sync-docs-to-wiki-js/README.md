# Sync docs from github repository to wiki-js

This action takes all files from current GitHub repository and sync them to wiki-js.

How it works:
1. Runs `Force sync` command on wiki-js preconfigured GitHub storage type.
2. Resolve files that needs to be updated/deleted.
3. Takes all files from current GitHub repository and syncs tags, that are defined in .md files metadata.

## Inputs

| Input name            | Description                                           |
|-----------------------|-------------------------------------------------------|
| `api-key`             | Api key for wiki-js api                               |
| `wiki-js-graphql-url` | Wiki-js graphql url                                   |
| `docs-config-path`    | Path to docs config file. Default: `docs-config.yaml` |
| `dry-run`             | If 'true', will not run any mutations on wiki js      |

## Example usage

```yml
      - uses: rollun-com/actions/sync-docs-to-wiki-js@master
        with:
          api-key: ${{ secrets.WIKI_JS_API_KEY }}
          wiki-js-graphql-url: https://wiki.rollun.net/graphql
          docs-config-path: docs-config.yaml
          dry-run: 'false'
```

## Docs config file

Files are resolved using [glob](https://www.npmjs.com/package/glob) package.
Refer to the docs, in case you need more complex patterns.

```yml
config:
  include:
    - '**/*.md'
  ignore:
    - 'docs/test/**'
    - '**/text.md'
    - '*.txt'
```
