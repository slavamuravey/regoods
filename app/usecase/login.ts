import { By, Key } from "selenium-webdriver";
import type { ThenableWebDriver } from "selenium-webdriver";
import { container } from "../service-container";
import { SECOND } from "../../libs/time";
import path from "path";
import { createSnapshotDirPath, createSnapshot } from "../utils/utils";
import type { WbUserRepository } from "../repository/types";
import type { CodeReceiver } from "../service/types";

export async function login(wbUserId?: string) {
  const driver: ThenableWebDriver = container.get("selenium-webdriver");
  const wbUserRepository: WbUserRepository = container.get("wb-user-repository");
  const codeReceiver: CodeReceiver = container.get("code-receiver");

  await driver.get("https://www.wildberries.ru");

  await driver.sleep(SECOND);

  const loginLink = driver.findElement(By.className("j-main-login"));
  await loginLink.click();
  await driver.sleep(SECOND);

  let wbUser;

  if (!wbUserId) {
    wbUser = await wbUserRepository.create();
  } else {
    try {
      wbUser = await wbUserRepository.find(wbUserId);
    } catch (e) {
      wbUser = await wbUserRepository.create();
    }
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
  await codeInput.sendKeys(code as string);
  await driver.sleep(SECOND * 3);

  const cookies = await driver.manage().getCookies();

  await wbUserRepository.update(wbUser.id, { cookies });

  const image = await driver.takeScreenshot();

  await createSnapshot(path.resolve(createSnapshotDirPath(), "login.png"), image);
}
