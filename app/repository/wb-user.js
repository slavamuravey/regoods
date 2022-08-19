const fs = require("fs");
const {createUserIdDirPath, createCookiesFilePath, createRentIdFilePath} = require("../utils/utils");

class WbUserRepository {
  smsActivateClient;

  constructor(smsActivateClient) {
    this.smsActivateClient = smsActivateClient;
  }

  async find(id) {
    const userIdDir = createUserIdDirPath(id);

    await fs.promises.access(userIdDir, fs.constants.F_OK);

    const result = {
      id
    };

    let cookies;

    try {
      cookies = await fs.promises.readFile(createCookiesFilePath(id), { encoding: "utf8" });
      result.cookies = JSON.parse(cookies);
    } catch (e) {}

    return result;
  }

  async create(payload) {
    let phone, rentId;

    if (!payload?.id) {
      const data = await this.smsActivateClient.getRentNumber({service: "uu"});
      phone = data.phone.number;
      rentId = data.phone.id;
    } else {
      phone = payload.id;
    }

    const userIdDir = createUserIdDirPath(phone);

    let isUserExists;

    try {
      await fs.promises.access(userIdDir, fs.constants.F_OK);

      isUserExists = true;
    } catch (e) {
      isUserExists = false;
    }

    if (isUserExists) {
      throw new Error(`user "${phone}" already exists.`);
    }

    await fs.promises.mkdir(userIdDir, { recursive: true });

    if (rentId) {
      await fs.promises.writeFile(createRentIdFilePath(phone), String(rentId));
    }

    await this.update(phone, {cookies: payload?.cookies});

    return {
      id: phone,
      cookies: payload?.cookies
    };
  }

  async update(id, payload) {
    if (payload.cookies) {
      await fs.promises.writeFile(createCookiesFilePath(id), JSON.stringify(payload.cookies));
    }
  }
}

module.exports = {
  WbUserRepository
};
