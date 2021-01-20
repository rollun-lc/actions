const core   = require('@actions/core');
const fs     = require("fs");
const github = require('@actions/github');

const DEFAULT_README_PATH       = './README.md'
const DEFAULT_JSON_SUMMARY_PATH = './coverage/coverage-summary.json'

try {
    let pathToReadme      = core.getInput('README');
    let pathToJsonSummary = core.getInput('coverage-summary');

    if (pathToReadme.length === 0) {
        console.log('Path to README file was not provided, using the default path', DEFAULT_README_PATH)
        pathToReadme = DEFAULT_README_PATH;
    }
    if (pathToJsonSummary.length === 0) {
        console.log('Path to json summary was not provided, using the default path', DEFAULT_JSON_SUMMARY_PATH)
        pathToJsonSummary = DEFAULT_JSON_SUMMARY_PATH;
    }

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const {total}     = JSON.parse(fs.readFileSync(pathToJsonSummary, 'utf-8'));
    const getBadge    = (value, percentage) => {
        if (percentage < 70) {
            return `Coverage%20${value}-${percentage}%25-red.svg`;
        } else if (percentage < 80) {
            return `Coverage%20${value}-${percentage}%25-orange.svg`;
        } else if (percentage < 100) {
            return `Coverage%20${value}-${percentage}%25-green.svg`;
        } else {
            return `Coverage%20${value}-0%25-red.svg`
        }
    }
    const allCoverage = {
        'Statements': getBadge('Statements', total.statements.pct),
        'Lines':      getBadge('Lines', total.lines.pct),
        'Functions':  getBadge('Functions', total.functions.pct),
        'Branches':   getBadge('Branches', total.branches.pct)
    }

    const getCoverageBadge = (name) => {
        return allCoverage[name];
    }

    const readMe = fs.readFileSync(pathToReadme, 'utf-8');

    fs.writeFileSync(pathToReadme, readMe.replace(/Coverage%20(.+)\-([.0-9]+)%25-(.+)\.svg/g, (match, name) => {
        return getCoverageBadge(name);
    }), 'utf-8');
} catch (error) {
    core.setFailed(error.message);
}
