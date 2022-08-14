const {wbUserRepository} = require("../service/wb-user-repository");
const {seleniumWebdriver: driver} = require("../service/selenium-webdriver");
const {SECOND} = require("../../libs/time");
const path = require("path");
const {createSnapshotDirPath, createSnapshot} = require("../utils/utils");

async function lk(wbUserId) {
  await driver.get("https://www.wildberries.ru");

  const wbUser = await wbUserRepository.find(wbUserId);
  const cookies = wbUser.getCookie();

  for (const cookie of cookies) {
    await driver.manage().addCookie(cookie);
  }

  await driver.get("https://www.wildberries.ru/lk");

  await driver.sleep(SECOND);

  const image = await driver.takeScreenshot();

  await createSnapshot(path.resolve(createSnapshotDirPath(), "lk.png"), image);
}

module.exports = {
  lk
}