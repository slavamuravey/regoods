import { By, Key } from "selenium-webdriver";
import { SECOND } from "../../../libs/time";
import { LoginUsecaseError } from "../login";
import { createStepMessage } from "../utils";
import { Click, CreateUser, Get, RentPhone, SendKeys } from "../actions";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserRepository } from "../../repository/wb-user";
import type { CodeReceiver } from "../../service/code-receiver";
import type { PhoneRenter } from "../../service/phone-renter";
import type { RandomNameGenerator } from "../../service/random-name-generator";
import type { LoginParams, LoginUsecase } from "../login";
import type { StepMessage } from "../step-message";

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    readonly wbUserRepository: WbUserRepository,
    readonly codeReceiver: CodeReceiver,
    readonly phoneRenter: PhoneRenter,
    readonly randomNameGenerator: RandomNameGenerator
  ) {
    this.wbUserRepository = wbUserRepository;
    this.codeReceiver = codeReceiver;
    this.phoneRenter = phoneRenter;
    this.randomNameGenerator = randomNameGenerator;
  }

  async* login({ wbUserId, gender, browser, headless, quit}: LoginParams): AsyncGenerator<StepMessage> {
    const wbUserRepository = this.wbUserRepository;
    const codeReceiver = this.codeReceiver;
    const phoneRenter = this.phoneRenter;
    const randomNameGenerator = this.randomNameGenerator;

    const driver = createDriver(browser, { headless });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page", await driver.takeScreenshot());

      const loginLink = driver.findElement(By.className("j-main-login"));
      await loginLink.click();
      await driver.sleep(SECOND);
      yield createStepMessage(new Click(), "Click login button", await driver.takeScreenshot());

      let phone: string;

      if (!wbUserId) {
        const result = await phoneRenter.rent();
        phone = result.phone;
        yield createStepMessage(new RentPhone(phone), "Rent new phone number");
      } else {
        phone = wbUserId;
      }

      const phoneInput = driver.findElement(By.className("input-item"));

      if (browser === "chrome") {
        await phoneInput.sendKeys(Key.HOME);
        await driver.sleep(SECOND);
        yield createStepMessage(new SendKeys(Key.HOME), "Send HOME key to phone input", await driver.takeScreenshot());
      }

      const phoneKeys = phone.slice(-10);
      await phoneInput.sendKeys(phoneKeys);
      await driver.sleep(SECOND);
      yield createStepMessage(new SendKeys(phoneKeys), "Send phone number keys to phone input", await driver.takeScreenshot());

      const requestCodeButton = driver.findElement(By.id("requestCode"));
      await requestCodeButton.click();
      await driver.sleep(SECOND * 5);
      yield createStepMessage(new Click(), "Click request code button", await driver.takeScreenshot());

      const code = await codeReceiver.receiveCode(phone);

      const codeInput = driver.findElement(By.className("j-input-confirm-code"));
      await codeInput.sendKeys(code as string);
      await driver.sleep(SECOND * 3);
      yield createStepMessage(new SendKeys(code as string), "Send code keys to code input", await driver.takeScreenshot());

      await driver.get("https://www.wildberries.ru/lk/details");
      await driver.sleep(SECOND * 3);
      yield createStepMessage(new Get("https://www.wildberries.ru/lk/details"), "Open profile details", await driver.takeScreenshot());

      let isAccountEmpty: boolean;

      try {
        await driver.findElement(By.xpath("//*[@data-name-letter]"));
        isAccountEmpty = false;
      } catch {
        isAccountEmpty = true;
      }

      if (!isAccountEmpty) {
        throw new LoginUsecaseError(`account "${phone}" is not empty.`);
      }

      if (gender) {
        const genderRadioButton = await driver.findElements(By.className("personal-data__radio"));
        const genderRadioButtonIndex = gender === "man" ? 0 : 1;
        await genderRadioButton[genderRadioButtonIndex].click();
        await driver.sleep(SECOND);
        yield createStepMessage(new Click(), "Click gender radio button", await driver.takeScreenshot());
      }

      const editNameButton = driver.findElement(By.className("btn-edit"));
      await editNameButton.click();
      await driver.sleep(SECOND);
      yield createStepMessage(new Click(), "Click edit name button", await driver.takeScreenshot());

      const name = await randomNameGenerator.generate(gender);

      const lastNameInput = driver.findElement(By.id("Item.LastName"));
      await lastNameInput.clear();
      await lastNameInput.sendKeys(name.lastName);
      yield createStepMessage(new SendKeys(name.lastName), "Send last name to last name input", await driver.takeScreenshot());

      const firstNameInput = driver.findElement(By.id("Item.FirstName"));
      await firstNameInput.clear();
      await firstNameInput.sendKeys(name.firstName);
      yield createStepMessage(new SendKeys(name.firstName), "Send first name to first name input", await driver.takeScreenshot());

      const saveNameButton = driver.findElement(By.className("btn-main"));
      await saveNameButton.click();
      await driver.sleep(SECOND);
      yield createStepMessage(new Click(), "Click save name button", await driver.takeScreenshot());

      const cookies = await driver.manage().getCookies();
      cookies.forEach(cookie => {
        // @ts-ignore
        if (cookie?.sameSite === "None") {
          // @ts-ignore
          delete cookie.sameSite;
        }
      });

      await wbUserRepository.create({ id: phone, cookies });
      yield createStepMessage(new CreateUser(phone, cookies), "Store user");
    } finally {
      if (quit) {
        driver.quit();
      }
    }
  }
}
