"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacer = void 0;
const replacer = (name, total) => getCoverageBadge(name, total);
exports.replacer = replacer;
const getCoverageBadge = (name, total) => allCoverage(name, total);
const getBadge = (value, percentage) => {
    if (percentage < 70) {
        return `Coverage%20${value}-${percentage}%25-red.svg`;
    }
    else if (percentage < 80) {
        return `Coverage%20${value}-${percentage}%25-orange.svg`;
    }
    else if (percentage < 100) {
        return `Coverage%20${value}-${percentage}%25-green.svg`;
    }
    else {
        return `Coverage%20${value}-0%25-red.svg`;
    }
};
const allCoverage = (name, total) => {
    const names = {
        'Statements': getBadge('Statements', total.statements.pct),
        'Lines': getBadge('Lines', total.lines.pct),
        'Functions': getBadge('Functions', total.functions.pct),
        'Branches': getBadge('Branches', total.branches.pct)
    };
    return names[name];
};
