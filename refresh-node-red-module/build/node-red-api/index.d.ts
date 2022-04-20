declare type NodeRedApiOpts = {
    baseUrl: string;
};
export declare class NodeRedApi {
    private readonly api;
    constructor({ baseUrl }: NodeRedApiOpts);
    refreshModule(name: string): Promise<void>;
    private getCSRFToken;
}
export {};
