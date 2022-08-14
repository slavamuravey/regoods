const fs = require("fs");
const {WbUser} = require("../entity/wb-user");
const path = require("path");

class WbUserRepository {
  async find(id) {
    const userIdDir = this.createUserIdDirPath(id);

    await fs.promises.access(userIdDir, fs.constants.F_OK);

    const user = new WbUser(id);

    try {
      const cookie = await fs.promises.readFile(this.createCookieFilePath(id), { encoding: "utf8" });
      user.setCookie(JSON.parse(cookie));
    } catch (e) {}

    return user;
  }

  async create(user) {
    const userIdDir = this.createUserIdDirPath(user.id);

    await fs.promises.mkdir(userIdDir, { recursive: true });

    const cookie = user.getCookie();

    if (cookie) {
      await fs.promises.writeFile(this.createCookieFilePath(user.id), JSON.stringify(cookie));
    }
  }

  createCookieFilePath(userId) {
    return path.resolve(this.createUserIdDirPath(userId), "cookie.json");
  }

  createUserIdDirPath(userId) {
    return path.resolve(process.env.APP_PATH, "data/wb-user", userId);
  }
}

module.exports = {
  WbUserRepository
};
