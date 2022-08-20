import { AxiosRequestConfig } from "axios";

export interface Environment {
  api: {
    smsActivate: {
      axios: AxiosRequestConfig
    },
    randomDataTools: {
      axios: AxiosRequestConfig
    }
  }
}
