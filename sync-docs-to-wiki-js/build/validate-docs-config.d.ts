export type DocsConfig = {
    config: {
        include: string[];
        ignore: string[];
    };
};
export declare function validateDocsConfig(config: any): config is DocsConfig;
export declare function isRequired(value: any): boolean;
