type MdFileMetadata = {
    tags: string;
    title: string;
    description: string;
    isPrivate?: boolean;
    isPublished?: boolean;
    locale?: string;
    path?: string;
};
export declare function validateMdFileMetadata(metadata: any): metadata is MdFileMetadata;
export {};
