import type { Environment } from "./types";

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
