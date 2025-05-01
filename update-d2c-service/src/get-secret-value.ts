import axios from 'axios';
import * as jwt from 'jsonwebtoken';

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


export async function getSecretValue(
  name: string,
  baseUrl: string,
  auth: {
    username: string;
    password: string;
  },
) {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${generateSmGhResolverToken(`${auth.username}:${auth.password}`)}`,
    }
  });

  const { data: secret } = await axiosInstance.get<{
    key: string;
    value: string;
  }>(`/${name}`);

  return secret.value;
}

export async function resolveSecrets(smUrl: string, names: string[], auth: { username: string; password: string }) {
  const headers = {
    Authorization: `Bearer ${generateSmGhResolverToken(`${auth.username}:${auth.password}`)}`,
  }

  const data: ResolveSecretsRequest = {
    ids: names,
  }

  const response = await axios.post<ResolveSecretsResponse>(smUrl, data, { headers });

  const missingSecrets: string[] = [];
  for (const {id, secret} of response.data.resolved) {
    if (secret === null) {
      missingSecrets.push(id);
    }
  }

  if (missingSecrets.length > 0) {
    throw new Error(`Some secrets not resolved: ${missingSecrets.join(', ')}`);
  }

  return response.data.resolved.map(({id, secret}) => ({ name: id, value: secret?.value as string }));
}

function generateSmGhResolverToken(secret: string) {
  const token = jwt.sign({}, secret, {
    algorithm: 'HS256',
    expiresIn: '1m',
    issuer: 'https://github.com/rollun-lc/actions/update-d2c-service',
    subject: 'https://github.com/rollun-lc/actions/update-d2c-service',
    audience: '/openapi/RollunSecretManager/v1/secrets/resolve',
  });

  return token;
}



