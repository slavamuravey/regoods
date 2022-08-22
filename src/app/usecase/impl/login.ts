import path from "path";
import { By, Key } from "selenium-webdriver";
import { SECOND } from "../../../libs/time";
import { createSnapshot, createSnapshotDirPath } from "../../utils/utils";
import type { ThenableWebDriver } from "selenium-webdriver";
import type { WbUserRepository } from "../../repository/wb-user";
import type { CodeReceiver } from "../../service/code-receiver";
import type { PhoneRenter } from "../../service/phone-renter";
import type { RandomNameGenerator } from "../../service/random-name-generator";
import type { LoginParams, LoginUsecase } from "../login";

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    readonly driver: ThenableWebDriver,
    readonly wbUserRepository: WbUserRepository,
    readonly codeReceiver: CodeReceiver,
    readonly phoneRenter: PhoneRenter,
    readonly randomNameGenerator: RandomNameGenerator
  ) {
    this.driver = driver;
    this.wbUserRepository = wbUserRepository;
    this.codeReceiver = codeReceiver;
    this.phoneRenter = phoneRenter;
    this.randomNameGenerator = randomNameGenerator;
  }

  async login(params: LoginParams) {
    const driver = this.driver;
    const wbUserRepository = this.wbUserRepository;
    const codeReceiver = this.codeReceiver;
    const phoneRenter = this.phoneRenter;
    const randomNameGenerator = this.randomNameGenerator;

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
}
