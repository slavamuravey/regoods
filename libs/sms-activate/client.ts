import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { GetRentNumberRequest, GetRentNumberResponse, GetRentStatusRequest, GetRentStatusResponse } from "./types";

export class Client {
  httpClient: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.httpClient = axios.create({ ...config });

    this.httpClient.interceptors.response.use(
      response => {
        const { data } = response;

        if (!data.status) {
          throw new Error("undefined error");
        }

        if (data.status === "error") {
          throw new Error(data?.message);
        }

        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  async getRentNumber({ service }: GetRentNumberRequest): Promise<GetRentNumberResponse> {
    const { data } = await this.httpClient.get("", {
      params: {
        action: "getRentNumber",
        service
      }
    });

    return data;
  }

  async getRentStatus({ id }: GetRentStatusRequest): Promise<GetRentStatusResponse>  {
    const { data } = await this.httpClient.get("", {
      params: {
        action: "getRentStatus",
        id
      }
    });

    return data;
  }
}
