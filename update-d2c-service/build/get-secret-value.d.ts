export interface SecretDto {
    id: string;
    value: string;
    version: number;
    createdAt: string;
}
export interface ResolveSecretsRequest {
    ids: string[];
}
export interface ResolvedSecret {
    id: string;
    secret: SecretDto | null;
}
export interface ResolveSecretsResponse {
    resolved: ResolvedSecret[];
}
export declare function getSecretValue(name: string, baseUrl: string, auth: {
    username: string;
    password: string;
}): Promise<string>;
export declare function resolveSecrets(smUrl: string, names: string[], auth: {
    username: string;
    password: string;
}): Promise<{
    name: string;
    value: string;
}[]>;
