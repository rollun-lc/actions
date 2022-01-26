export declare type LoginResponse = {
    user: {
        email: string;
    };
    acc: {};
    member: {
        token: string;
    };
};
export declare type EntityService = {
    name: string;
    id: string;
};
export declare type EntitiesResponse = {
    result: {
        services: EntityService[];
    };
};
export declare type GenerateHookResponse = {
    result: string;
};
