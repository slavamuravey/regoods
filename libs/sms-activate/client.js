const axios = require("axios");

class Client {
  httpClient;

  constructor(config) {
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

  async getRentNumber({ service }) {
    const { data } = await this.httpClient.get("", {
      params: {
        action: "getRentNumber",
        service
      }
    });

    return data;
  }

  async getRentStatus({ id }) {
    const { data } = await this.httpClient.get("", {
      params: {
        action: "getRentStatus",
        id
      }
    });

    return data;
  }
}

module.exports = {
  Client
}
