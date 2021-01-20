import {
  JSONSummary,
  PossibleBadgeNames,
  PossiblePercentage
} from "./types";

const replacer         = (name: PossibleBadgeNames, total: JSONSummary) => getCoverageBadge(name, total);
const getCoverageBadge = (name: PossibleBadgeNames, total: JSONSummary) => allCoverage(name, total);
const getBadge         = (value: PossibleBadgeNames, percentage: PossiblePercentage): string => {
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
const allCoverage      = (name: PossibleBadgeNames, total: JSONSummary) => {
  const names = {
    'Statements': getBadge('Statements', total.statements.pct),
    'Lines':      getBadge('Lines', total.lines.pct),
    'Functions':  getBadge('Functions', total.functions.pct),
    'Branches':   getBadge('Branches', total.branches.pct)
  }

  return names[name];
}

export {
  replacer
}
