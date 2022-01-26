declare type UpdateServiceParams = {
    serviceName: string;
    email: string;
    password: string;
    commaSeparatedActions: string;
};
declare const updateService: ({ serviceName, email, commaSeparatedActions, password, }: UpdateServiceParams) => Promise<void>;
export { updateService };
