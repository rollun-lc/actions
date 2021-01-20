"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacer = void 0;
var replacer = function (name, total) { return getCoverageBadge(name, total); };
exports.replacer = replacer;
var getCoverageBadge = function (name, total) { return allCoverage(name, total); };
var getBadge = function (value, percentage) {
    if (percentage < 70) {
        return "Coverage%20" + value + "-" + percentage + "%25-red.svg";
    }
    else if (percentage < 80) {
        return "Coverage%20" + value + "-" + percentage + "%25-orange.svg";
    }
    else if (percentage < 100) {
        return "Coverage%20" + value + "-" + percentage + "%25-green.svg";
    }
    else {
        return "Coverage%20" + value + "-0%25-red.svg";
    }
};
var allCoverage = function (name, total) {
    var names = {
        'Statements': getBadge('Statements', total.statements.pct),
        'Lines': getBadge('Lines', total.lines.pct),
        'Functions': getBadge('Functions', total.functions.pct),
        'Branches': getBadge('Branches', total.branches.pct)
    };
    return names[name];
};
