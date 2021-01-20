# Change badges in README.md file

This action changes README.md file, if it has coverage badges in this specific format
#### ```![Coverage badge](https://img.shields.io/badge/Coverage%20Statements-13.33%25-red.svg)```

## Inputs

### `README`

**Required** The path to the README.md file to be changed.

### `coverage-summary`

**Required** The path to the coverage summary. Has to be a json file.
If you are using jest, run tests with a flag: ```--coverageReporters="json-summary"```

## Outputs

### `result`

Outputs the result of an actions, could be false or true

## Example usage

- uses: rollun-com/actions/updateCoverageBadge@master
  with:
    README: './README.md'
    coverage-summary: './coverage/coverage-summary.json'
