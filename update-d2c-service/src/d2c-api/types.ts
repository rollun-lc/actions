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
  name: string;
  id: string;
};

export type EntitiesResponse = {
  result: {
    services: EntityService[];
  };
};

export type GenerateHookResponse = {
  result: string;
};
