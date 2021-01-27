declare const replacer: (pathToJsonSummary: string, pathToReadme: string, disableCommit: string) => Promise<void>;
declare const run: (exec: Function) => Promise<void>;
export { replacer, run };
