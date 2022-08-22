import type { AxiosRequestConfig } from "axios";
import type { Config } from "../../libs/random-data-tools/types";

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

export const environment: Environment = {
  api: {
    smsActivate: {
      axios: {
        baseURL: process.env.SMS_ACTIVATE_BASE_URL,
        params: {
          api_key: process.env.SMS_ACTIVATE_API_KEY
        }
      }
    },
    randomDataTools: {
      fetch: {
        baseURL: process.env.RANDOM_DATA_TOOLS_BASE_URL
      }
    }
  }
}
