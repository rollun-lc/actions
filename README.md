# Rollun Github actions

This repo contains actions that are being used in CI/CD pipelines.

## Actions

- [update-d2c-service](update-d2c-service) - updates service in D2C. This action will recreate and pull latest images of a container.
- [refresh-node-red-module](refresh-node-red-module) - uploads new version of npm package to node-red regestry
- [update-coverage-badge](update-coverage-badge) - adds/updates badges with coverage. Only works with Jest.

## Composite actions

Every composite action goes to [composite folder](composite)

- [deploy](composite/deploy) - builds and pushes docker container to ghcr.io regestry. already contains [update-d2c-service](update-d2c-service) action

## Contribution

To contribute you need:
- source files
- tests(at least 80% of coverage)
- build and node_modules folders
- README file
