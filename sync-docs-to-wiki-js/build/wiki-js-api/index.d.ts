export type UpdateOrCreatePageOptions = {
    content: string;
    description: string;
    isPrivate: boolean;
    isPublished: boolean;
    locale: string;
    path: string;
    tags: string[];
    title: string;
};
export declare class WikiJsApi {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly client;
    constructor(apiKey: string, baseUrl: string);
    createPage(page: UpdateOrCreatePageOptions): Promise<void>;
    getPageByNameSafe(name: string): Promise<{
        id: number;
        path: string;
        tags: string[];
        title: string;
    } | null>;
    getPageByName(name: string): Promise<{
        id: number;
        path: string;
        tags: string[];
        title: string;
    }>;
    getPageById(id: string): Promise<{
        id: number;
    }>;
    updatePageWithTags(pageId: number, page: UpdateOrCreatePageOptions): Promise<void>;
    tryDeletePage(name: string): Promise<void>;
}
