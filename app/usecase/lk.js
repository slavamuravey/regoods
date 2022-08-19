const {SECOND} = require("../../libs/time");
const path = require("path");
const {createSnapshotDirPath, createSnapshot} = require("../utils/utils");
const {container} = require("../service-container");

async function lk(wbUserId) {
  const driver = container.get("selenium-webdriver");
  const wbUserRepository = container.get("wb-user-repository");

  await driver.get("https://www.wildberries.ru");

  const wbUser = await wbUserRepository.find(wbUserId);
  const cookies = wbUser.cookies;

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