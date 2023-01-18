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
    id: string;
    name: string;
    image: string;
    description: string;
    type: string;
    project: string;
    crons: {
        active: boolean;
        name: string;
        command: string;
        time: string;
    }[];
    process: string;
};
export declare type EntityProject = {
    id: string;
    name: string;
};
export declare type EntityHost = {
    id: string;
    name: string;
};
export declare type EntitiesResponse = {
    result: {
        services: EntityService[];
        projects: EntityProject[];
        hosts: EntityHost[];
    };
};
export declare type GenerateHookResponse = {
    result: string;
};
export declare type D2CServiceConfig = {
    'initial-service-host': string;
    'd2c-service-config': {
        type: string;
        image: string;
        version: string;
        name: string;
        description: string;
        ports: {
            value: number;
            protocol: 'TCP' | 'UDP';
        }[];
        project: string;
        crons: {
            active: boolean;
            name: string;
            command: string;
            time: string;
        }[];
    };
};
