import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  GetRandomNameRequest,
  GetRandomNameResponse,
  GetRequest,
  GetResponse,
  Client as ClientInterface
} from "./types";

export class Client implements ClientInterface {
  private httpClient: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.httpClient = axios.create({ ...config });
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
    const { data } = await this.httpClient.get("", {
      params: {
        ...payload
      }
    });

    return data;
  }
}
