export interface GetRequest {
  count: number;
  gender: "man" | "woman" | "unset";
  unescaped: boolean;
  params: string;
}

export type GetResponse = Record<string, any> | Record<string, any>[];

export interface GetRandomNameRequest {
  gender: "man" | "woman" | "unset";
}

export interface GetRandomNameResponse {
  LastName: string;
  FirstName: string;
}

export interface Client {
  getRandomName({ gender }: GetRandomNameRequest): Promise<GetRandomNameResponse>;

  get(payload: GetRequest): Promise<GetResponse>;
}
