import { By, Key } from "selenium-webdriver";
import { SECOND } from "../../../libs/time";
import { LoginUsecaseError } from "../login";
import { getCookies } from "../utils";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { CodeReceiver } from "../../service/code-receiver";
import type { PhoneRenter } from "../../service/phone-renter";
import type { RandomNameGenerator } from "../../service/random-name-generator";
import type { LoginParams, LoginUsecase } from "../login";
import type { StepMessage } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import _ from "lodash";
import UserAgent from "user-agents";
import { BrowserActionNotification, DebuggerAddressNotification } from "../step-message";

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    readonly wbUserSessionRepository: WbUserSessionRepository,
    readonly codeReceiver: CodeReceiver,
    readonly phoneRenter: PhoneRenter,
    readonly randomNameGenerator: RandomNameGenerator,
    readonly proxyResolver: ProxyResolver
  ) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.codeReceiver = codeReceiver;
    this.phoneRenter = phoneRenter;
    this.randomNameGenerator = randomNameGenerator;
    this.proxyResolver = proxyResolver;
  }

  async* login({ phone, gender, browser, proxy, userAgent, headless, quit}: LoginParams): AsyncGenerator<StepMessage> {
    const wbUserSessionRepository = this.wbUserSessionRepository;
    const codeReceiver = this.codeReceiver;
    const phoneRenter = this.phoneRenter;
    const randomNameGenerator = this.randomNameGenerator;

    const userAgentResolved = userAgent ? userAgent : String(new UserAgent({ deviceCategory: "desktop" }));
    const driver = createDriver(browser, {
      headless,
      proxy: proxy === undefined ? await this.proxyResolver.resolve() : proxy,
      userAgent: userAgentResolved
    });

    try {
      if (browser === "chrome") {
        const caps = await driver.getCapabilities();
        yield new DebuggerAddressNotification("Debugger address", {
          debuggerAddress: caps.get("goog:chromeOptions").debuggerAddress
        });
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Open main page");

      const loginLink = driver.findElement(By.className("j-main-login"));
      await loginLink.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Click login button");

      let phoneResolved: string;

      if (!phone) {
        const result = await phoneRenter.rent();
        phoneResolved = result.phone;
        yield new BrowserActionNotification(`Rent new phone number "${phoneResolved}"`);
      } else {
        phoneResolved = phone;
      }

      const phoneInput = driver.findElement(By.className("input-item"));

      if (browser === "chrome") {
        await phoneInput.sendKeys(Key.HOME);
        await driver.sleep(_.random(SECOND, SECOND * 2));
        yield new BrowserActionNotification("Send HOME key to phone input");
      }

      const phoneKeys = phoneResolved.slice(-10);
      await phoneInput.sendKeys(phoneKeys);
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Send phone number keys to phone input");

      const requestCodeButton = driver.findElement(By.id("requestCode"));
      await requestCodeButton.click();
      await driver.sleep(_.random(SECOND * 5, SECOND * 10));
      yield new BrowserActionNotification("Click request code button");

      const code = await codeReceiver.receiveCode(phoneResolved);

      const codeInput = driver.findElement(By.className("j-input-confirm-code"));
      await codeInput.sendKeys(code as string);
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield new BrowserActionNotification("Send code keys to code input");

      await driver.get("https://www.wildberries.ru/lk/details");
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield new BrowserActionNotification("Open profile details");

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
        yield new BrowserActionNotification("Click gender radio button");
      }

      const editNameButton = driver.findElement(By.className("btn-edit"));
      await editNameButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Click edit name button");

      const name = await randomNameGenerator.generate(gender);

      // WB requires only first name now. Uncomment if WB will require last name again.
      // const lastNameInput = driver.findElement(By.id("Item.LastName"));
      // await lastNameInput.clear();
      // await lastNameInput.sendKeys(name.lastName);
      // yield new BrowserActionNotification("Send last name to last name input");

      const firstNameInput = driver.findElement(By.id("Item.FirstName"));
      await firstNameInput.clear();
      await firstNameInput.sendKeys(name.firstName);
      yield new BrowserActionNotification("Send first name to first name input");

      const saveNameButton = driver.findElement(By.className("btn-main"));
      await saveNameButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Click save name button");

      const cookies = await getCookies(driver);

      await wbUserSessionRepository.create({ phone: phoneResolved, cookies, userAgent: userAgentResolved });
      yield new BrowserActionNotification("Store user");
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }
}
