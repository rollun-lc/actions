type PossibleBadgeNames =
  'Statements'
  | 'Lines'
  | 'Functions'
  | 'Branches';
type PossiblePercentage = number;
type CoverageByType = {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface JSONSummary {
  lines: CoverageByType,
  statements: CoverageByType,
  functions: CoverageByType,
  branches: CoverageByType,
}

export {
  PossibleBadgeNames,
  PossiblePercentage,
  JSONSummary
}
