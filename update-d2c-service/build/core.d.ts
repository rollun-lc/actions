declare type UpdateServiceParams = {
    serviceName: string;
    configPath?: string;
    email: string;
    password: string;
    commaSeparatedActions: string;
    d2cBaseApiUrl: string;
};
declare const updateService: ({ serviceName, configPath, email, commaSeparatedActions, password, d2cBaseApiUrl, }: UpdateServiceParams) => Promise<void>;
export { updateService };
