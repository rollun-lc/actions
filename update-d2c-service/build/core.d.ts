declare type UpdateServiceParams = {
    serviceName: string;
    email: string;
    password: string;
    commaSeparatedActions: string;
    d2cBaseApiUrl: string;
};
declare const updateService: ({ serviceName, email, commaSeparatedActions, password, d2cBaseApiUrl, }: UpdateServiceParams) => Promise<void>;
export { updateService };
