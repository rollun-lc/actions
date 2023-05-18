export declare class WikiJsApi {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly client;
    constructor(apiKey: string, baseUrl: string);
    syncFromGithub(): Promise<void>;
    getPageByName(name: any): Promise<{
        id: number;
        path: string;
        tags: string[];
        title: string;
    }>;
    getPageById(id: any): Promise<{
        id: number;
    }>;
    updatePageWithTags(pageId: any, tags: any): Promise<void>;
    tryDeletePage(name: any): Promise<void>;
}
