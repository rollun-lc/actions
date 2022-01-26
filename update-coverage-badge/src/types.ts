type BadgeName = 'Statements' | 'Lines' | 'Functions' | 'Branches';
type Percentage = number;
type CoverageByType = {
  total: Percentage;
  covered: Percentage;
  skipped: Percentage;
  pct: Percentage;
};

interface JSONSummary {
  lines: CoverageByType;
  statements: CoverageByType;
  functions: CoverageByType;
  branches: CoverageByType;
}

export { BadgeName, Percentage, JSONSummary };
