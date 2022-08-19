const {By, Key} = require("selenium-webdriver");
const {container} = require("../service-container");
const {SECOND} = require("../../libs/time");
const path = require("path");
const {createSnapshotDirPath, createSnapshot} = require("../utils/utils");

async function login(wbUserId) {
  const driver = container.get("selenium-webdriver");
  const wbUserRepository = container.get("wb-user-repository");
  const codeReceiver = container.get("code-receiver");

  await driver.get("https://www.wildberries.ru");

  await driver.sleep(SECOND);

  const loginLink = driver.findElement(By.className("j-main-login"));
  await loginLink.click();
  await driver.sleep(SECOND);

  let wbUser;

  try {
    wbUser = await wbUserRepository.find(wbUserId);
  } catch (e) {
    wbUser = await wbUserRepository.create();
  }

  const phone = wbUser.id;

  const phoneInput = driver.findElement(By.className("input-item"));
  await phoneInput.sendKeys(Key.HOME);
  await phoneInput.sendKeys(phone.slice(-10));
  await driver.sleep(SECOND);

  await driver.findElement(By.id("requestCode")).click();
  await driver.sleep(SECOND * 5);

  const code = await codeReceiver.receiveCode(phone);

  const codeInput = driver.findElement(By.className("j-input-confirm-code"));
  await codeInput.sendKeys(code);
  await driver.sleep(SECOND * 3);

  const cookies = await driver.manage().getCookies();

  await wbUserRepository.update(wbUser.id, {cookies});

  const image = await driver.takeScreenshot();

  await createSnapshot(path.resolve(createSnapshotDirPath(), "login.png"), image);
}

module.exports = {
  login
}