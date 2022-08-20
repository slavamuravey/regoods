import { AxiosRequestConfig } from "axios";
import { Config } from "../../libs/random-data-tools/types";

export interface Environment {
  api: {
    smsActivate: {
      axios: AxiosRequestConfig
    },
    randomDataTools: {
      fetch: Config
    }
  }
}
