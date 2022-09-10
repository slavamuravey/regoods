import { By, Key } from "selenium-webdriver";
import { SECOND } from "../../../libs/time";
import { LoginUsecaseError } from "../login";
import { createStepMessage, getCookies } from "../utils";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { CodeReceiver } from "../../service/code-receiver";
import type { PhoneRenter } from "../../service/phone-renter";
import type { RandomNameGenerator } from "../../service/random-name-generator";
import type { LoginParams, LoginUsecase } from "../login";
import type { StepMessage } from "../step-message";
import _ from "lodash";
import UserAgent from "user-agents";

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    readonly wbUserSessionRepository: WbUserSessionRepository,
    readonly codeReceiver: CodeReceiver,
    readonly phoneRenter: PhoneRenter,
    readonly randomNameGenerator: RandomNameGenerator
  ) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.codeReceiver = codeReceiver;
    this.phoneRenter = phoneRenter;
    this.randomNameGenerator = randomNameGenerator;
  }

  async* login({ phone, gender, browser, proxy, userAgent, headless, quit}: LoginParams): AsyncGenerator<StepMessage> {
    const wbUserSessionRepository = this.wbUserSessionRepository;
    const codeReceiver = this.codeReceiver;
    const phoneRenter = this.phoneRenter;
    const randomNameGenerator = this.randomNameGenerator;

    const userAgentResolved = userAgent ? userAgent : String(new UserAgent({ deviceCategory: "desktop" }));
    const driver = createDriver(browser, { headless, proxy, userAgent: userAgentResolved });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Open main page");

      const loginLink = driver.findElement(By.className("j-main-login"));
      await loginLink.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click login button");

      let phoneResolved: string;

      if (!phone) {
        const result = await phoneRenter.rent();
        phoneResolved = result.phone;
        yield createStepMessage(`Rent new phone number "${phoneResolved}"`);
      } else {
        phoneResolved = phone;
      }

      const phoneInput = driver.findElement(By.className("input-item"));

      if (browser === "chrome") {
        await phoneInput.sendKeys(Key.HOME);
        await driver.sleep(_.random(SECOND, SECOND * 2));
        yield createStepMessage("Send HOME key to phone input");
      }

      const phoneKeys = phoneResolved.slice(-10);
      await phoneInput.sendKeys(phoneKeys);
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Send phone number keys to phone input");

      const requestCodeButton = driver.findElement(By.id("requestCode"));
      await requestCodeButton.click();
      await driver.sleep(_.random(SECOND * 5, SECOND * 10));
      yield createStepMessage("Click request code button");

      const code = await codeReceiver.receiveCode(phoneResolved);

      const codeInput = driver.findElement(By.className("j-input-confirm-code"));
      await codeInput.sendKeys(code as string);
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield createStepMessage("Send code keys to code input");

      await driver.get("https://www.wildberries.ru/lk/details");
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield createStepMessage("Open profile details");

      let isAccountEmpty: boolean;

      try {
        await driver.findElement(By.xpath("//*[@data-name-letter]"));
        isAccountEmpty = false;
      } catch {
        isAccountEmpty = true;
      }

      if (!isAccountEmpty) {
        throw new LoginUsecaseError(`account "${phoneResolved}" is not empty.`);
      }

      if (gender) {
        const genderRadioButton = await driver.findElements(By.className("personal-data__radio"));
        const genderRadioButtonIndex = gender === "man" ? 0 : 1;
        await genderRadioButton[genderRadioButtonIndex].click();
        await driver.sleep(_.random(SECOND, SECOND * 2));
        yield createStepMessage("Click gender radio button");
      }

      const editNameButton = driver.findElement(By.className("btn-edit"));
      await editNameButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click edit name button");

      const name = await randomNameGenerator.generate(gender);

      const lastNameInput = driver.findElement(By.id("Item.LastName"));
      await lastNameInput.clear();
      await lastNameInput.sendKeys(name.lastName);
      yield createStepMessage("Send last name to last name input");

      const firstNameInput = driver.findElement(By.id("Item.FirstName"));
      await firstNameInput.clear();
      await firstNameInput.sendKeys(name.firstName);
      yield createStepMessage("Send first name to first name input");

      const saveNameButton = driver.findElement(By.className("btn-main"));
      await saveNameButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click save name button");

      const cookies = await getCookies(driver);

      await wbUserSessionRepository.create({ phone: phoneResolved, cookies, userAgent: userAgentResolved });
      yield createStepMessage("Store user");
    } finally {
      if (quit) {
        driver.quit();
      }
    }
  }
}
