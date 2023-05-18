declare type SyncDocToWikiJsParams = {
    apiKey: string;
    baseUrl: string;
    docsConfigPath: string;
    dryRun?: boolean;
};
export declare function syncDocsToWikiJs({ apiKey, baseUrl, docsConfigPath, dryRun, }: SyncDocToWikiJsParams): Promise<void>;
export {};
