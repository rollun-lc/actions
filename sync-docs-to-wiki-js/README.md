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
| `docs-config-path`    | Path to docs config file. Default: `docs-config.json` |

## Example usage

```yml
      - uses: rollun-com/actions/refresh-node-red-module@master
        with:
          name: node-red-contrib-rollun-delovod
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
