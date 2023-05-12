declare type UpdateServiceParams = {
    serviceName: string;
    configPath?: string;
    email: string;
    password: string;
    commaSeparatedActions: string;
    d2cBaseApiUrl: string;
    smUsername?: string;
    smPassword?: string;
};
declare const updateService: ({ serviceName, configPath, email, commaSeparatedActions, password, d2cBaseApiUrl, smUsername, smPassword, }: UpdateServiceParams) => Promise<void>;
export { updateService };
