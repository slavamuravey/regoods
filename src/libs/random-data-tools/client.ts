import fetch from "node-fetch";
import type {
  Client as ClientInterface,
  Config,
  GetRandomNameRequest,
  GetRandomNameResponse,
  GetRequest,
  GetResponse
} from "./types";

export class Client implements ClientInterface {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async getRandomName({ gender }: GetRandomNameRequest): Promise<GetRandomNameResponse> {
    return await this.get({
      count: 1,
      gender,
      unescaped: false,
      params: "LastName,FirstName"
    }) as GetRandomNameResponse;
  }

  async get(payload: GetRequest): Promise<GetResponse> {
    const url = new URL(this.config.baseURL || "");
    const params = {
      ...payload
    };

    url.search = new URLSearchParams(params as unknown as Record<string, string>).toString();

    const response: GetResponse = await fetch(url).then((response) => response.json());

    if ("error_code" in response) {
      throw response;
    }

    return response;
  }
}
