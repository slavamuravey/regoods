import { By, Key } from "selenium-webdriver";
import type { ThenableWebDriver } from "selenium-webdriver";
import { container } from "../service-container";
import { SECOND } from "../../libs/time";
import path from "path";
import { createSnapshotDirPath, createSnapshot } from "../utils/utils";
import type { WbUserRepository } from "../repository/types";
import type { CodeReceiver, PhoneRenter, RandomNameGenerator } from "../service/types";
import type { LoginParams } from "./types";

export async function login(params: LoginParams) {
  const driver: ThenableWebDriver = container.get("selenium-webdriver");
  const wbUserRepository: WbUserRepository = container.get("wb-user-repository");
  const codeReceiver: CodeReceiver = container.get("code-receiver");
  const phoneRenter: PhoneRenter = container.get("phone-renter");
  const randomNameGenerator: RandomNameGenerator = container.get("random-name-generator");

  await driver.get("https://www.wildberries.ru");

  await driver.sleep(SECOND);

  const loginLink = driver.findElement(By.className("j-main-login"));
  await loginLink.click();
  await driver.sleep(SECOND);

  let phone: string;

  if (!params.wbUserId) {
    const result = await phoneRenter.rent();
    phone = result.phone;
  } else {
    phone = params.wbUserId;
  }

  const phoneInput = driver.findElement(By.className("input-item"));
  await phoneInput.sendKeys(Key.HOME);
  await phoneInput.sendKeys(phone.slice(-10));
  await driver.sleep(SECOND);

  const requestCodeButton = driver.findElement(By.id("requestCode"));
  await requestCodeButton.click();
  await driver.sleep(SECOND * 5);

  const code = await codeReceiver.receiveCode(phone);

  const codeInput = driver.findElement(By.className("j-input-confirm-code"));
  await codeInput.sendKeys(code as string);
  await driver.sleep(SECOND * 3);

  await driver.get("https://www.wildberries.ru/lk/details");
  await driver.sleep(SECOND);

  let isAccountEmpty: boolean;

  try {
    await driver.findElement(By.xpath("//*[@data-name-letter]"));
    isAccountEmpty = true;
  } catch {
    isAccountEmpty = false;
  }

  if (isAccountEmpty) {
    const image = await driver.takeScreenshot();

    await createSnapshot(path.resolve(createSnapshotDirPath(), "login-not-empty-account.png"), image);

    throw new Error(`account "${phone}" is not empty.`);
  }

  const gender = params.gender;

  if (gender) {
    const genderRadioButton = await driver.findElements(By.className("personal-data__radio"));
    const genderRadioButtonIndex = gender === "man" ? 0 : 1;
    await genderRadioButton[genderRadioButtonIndex].click();
    await driver.sleep(SECOND);
  }

  const editNameButton = driver.findElement(By.className("btn-edit"));
  await editNameButton.click();
  await driver.sleep(SECOND);

  const name = await randomNameGenerator.generate(gender);

  const lastNameInput = driver.findElement(By.id("Item.LastName"));
  await lastNameInput.clear();
  await lastNameInput.sendKeys(name.lastName);

  const firstNameInput = driver.findElement(By.id("Item.FirstName"));
  await firstNameInput.clear();
  await firstNameInput.sendKeys(name.firstName);

  const saveNameButton = driver.findElement(By.className("btn-main"));
  await saveNameButton.click();
  await driver.sleep(SECOND);

  const cookies = await driver.manage().getCookies();

  await wbUserRepository.create({ id: phone, cookies });

  const image = await driver.takeScreenshot();

  await createSnapshot(path.resolve(createSnapshotDirPath(), "login.png"), image);
}
