const {By, Key} = require("selenium-webdriver");
const {DateTime} = require("luxon");
const {pollSmsCode, getRentIdByPhone} = require("./utils");
const {WbUser} = require("../entity/wb-user");
const {wbUserRepository} = require("../service/wb-user-repository");
const {seleniumWebdriver: driver} = require("../service/selenium-webdriver");
const {SECOND} = require("../../libs/time");
const path = require("path");
const {createSnapshotDirPath, createSnapshot} = require("../utils/utils");
const {smsActivateClient} = require("../service/sms-activate-client");

async function login(wbUserId) {
  await driver.get("https://www.wildberries.ru");

  await driver.sleep(SECOND);

  const loginLink = driver.findElement(By.className("j-main-login"));
  await loginLink.click();
  await driver.sleep(SECOND);

  let phone;

  if (!wbUserId) {
    const data = await smsActivateClient.getRentNumber({service: "uu"});
    phone = data.phone.number;
  } else {
    phone = wbUserId;
  }

  const rentId = await getRentIdByPhone(phone);

  const phoneInput = driver.findElement(By.className("input-item"));
  await phoneInput.sendKeys(Key.HOME);
  await phoneInput.sendKeys(phone.slice(-10));
  await driver.sleep(SECOND);

  await driver.findElement(By.id("requestCode")).click();
  await driver.sleep(SECOND * 5);

  const now = DateTime.now();

  const code = await pollSmsCode(rentId, data => {
    const date = data?.values?.[0]?.date;

    if (!date) {
      throw new Error('no "date" field in response.');
    }

    const lastSmsDateTime = DateTime.fromFormat(`${date} +3`, "y-LL-dd TT Z");

    if (!lastSmsDateTime.isValid) {
      throw new Error(`invalid value "${date}" for field "date" in response, reason: ${lastSmsDateTime.invalidReason}.`);
    }

    if (lastSmsDateTime > now) {
      return data?.values?.[0]?.text?.match(/(\d+)/)[0];
    }

    throw new Error(`last code is outdated: now is "${now}", last date is: ${lastSmsDateTime}`);
  });

  const codeInput = driver.findElement(By.className("j-input-confirm-code"));
  await codeInput.sendKeys(code);
  await driver.sleep(SECOND * 3);

  const cookies = await driver.manage().getCookies();

  const wbUser = new WbUser(phone);
  wbUser.setCookie(cookies);

  await wbUserRepository.create(wbUser);

  const image = await driver.takeScreenshot();

  await createSnapshot(path.resolve(createSnapshotDirPath(), "login.png"), image);
}

module.exports = {
  login
}