export const environment = {
  api: {
    smsActivate: {
      axios: {
        baseURL: process.env.SMS_ACTIVATE_BASE_URL,
        params: {
          api_key: process.env.SMS_ACTIVATE_API_KEY
        }
      }
    }
  }
}
