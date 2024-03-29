export type LoginResponse = {
  user: {
    email: string;
    // ...etc
  };
  acc: {
    // account info
  };
  member: {
    token: string;
  };
};

export type EntityService = {
  id: string;
  name: string;
  image: string;
  description: string;
  type: string;
  project: string;
  crons: { active: boolean; name: string; command: string; time: string }[];
  process: string;
};

export type EntityProject = {
  id: string;
  name: string;
};

export type EntityHost = {
  id: string;
  name: string;
};

export type EntityAccount = {
  id: string;
  shortId: string;
};

export type EntitiesResponse = {
  result: {
    services: EntityService[];
    projects: EntityProject[];
    hosts: EntityHost[];
    accounts: EntityAccount[];
  };
};

export type GenerateHookResponse = {
  result: string;
};

export type D2CServiceConfig = {
  'initial-service-host': string;
  'd2c-service-config': {
    type: string; // example - docker, nginx
    image: string;
    version: string;
    name: string;
    description: string;
    ports: { value: number; protocol: 'TCP' | 'UDP' }[];
    project: string;
    crons: { active: boolean; name: string; command: string; time: string }[];
    configs?: { custom: boolean; name: string; text: string }[];
    env?: { name: string; value: string }[];
    services?: {
      name: string;
      appRoot: string;
      config?: string;
      type: 'fastcgi' | 'custom';
      file?: string;
      dnsResolver?: string;
    }[];
  };
};
