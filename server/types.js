// @flow
export type Model = {
  id: string,
};

export type Cache = {
  set: (string, any) => Promise<any>,
  get: string => Promise<any>,
};

export type Context = {
  cache: Cache,
};
