import { SECOND } from "../../../libs/time";
import type { CodeParams, CodeScenario } from "../code";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { StepMessage } from "../step-message";
import { BrowserActionNotification, DebuggerAddressNotification, DeliveryItemNotification } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import { By, until, WebElement } from "selenium-webdriver";
import { createWait } from "../utils";
import { ScenarioError } from "../error";
import _ from "lodash";

export class CodeScenarioImpl implements CodeScenario {
  constructor(
    readonly wbUserSessionRepository: WbUserSessionRepository,
    readonly proxyResolver: ProxyResolver
  ) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.proxyResolver = proxyResolver;
  }

  async* code({ phone, browser, proxy, headless, quit }: CodeParams): AsyncGenerator<StepMessage> {
    const wbUserSession = await this.wbUserSessionRepository.findOneByPhone(phone);

    const { userAgent } = wbUserSession;

    const driver = createDriver(browser, {
      headless,
      proxy: proxy === undefined ? await this.proxyResolver.resolve() : proxy,
      userAgent
    });
    const wait = createWait(driver, SECOND * 10);

    try {
      if (browser === "chrome") {
        const caps = await driver.getCapabilities();
        yield new DebuggerAddressNotification("Debugger address", {
          debuggerAddress: caps.get("goog:chromeOptions").debuggerAddress
        });
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND * 2);
      yield new BrowserActionNotification("Open main page");

      const cookies = wbUserSession.cookies;

      for (const cookie of cookies) {
        if (![".wildberries.ru", "www.wildberries.ru"].includes(cookie.domain as string)) {
          continue;
        }
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));

      try {
        await driver.findElement(By.className("j-item-profile"));
      } catch {
        throw new ScenarioError(`unable to login`);
      }

      await driver.get("https://www.wildberries.ru/lk/myorders/delivery");
      await driver.sleep(SECOND * 5);
      const deliveryIcon = await wait(until.elementLocated(By.className("navbar-pc__icon--delivery")));
      await wait(until.elementIsVisible(deliveryIcon));

      let itemsDeliveryNotificationIconCount = 0;

      try {
        const deliveryCountNotification = await driver.findElement(By.css(".navbar-pc__icon--delivery .navbar-pc__notify"));
        itemsDeliveryNotificationIconCount = parseInt(await deliveryCountNotification.getText());
      } catch {
      }

      yield new BrowserActionNotification("Open delivery page", {
        itemsDeliveryNotificationIconCount
      });

      let deliveryAddresses: WebElement[] = [];
      if (itemsDeliveryNotificationIconCount > 0) {
        deliveryAddresses = await wait(until.elementsLocated(By.className("delivery-block__content")));
      }

      await driver.sleep(SECOND * 2);

      for (const deliveryAddress of deliveryAddresses) {
        let code;

        try {
          code = await deliveryAddress.findElement(By.className("delivery-code__value")).getText();
        } catch {
          continue;
        }

        const deliveryItems = await deliveryAddress.findElements(By.className("goods-list-delivery__item"));

        const profileIcon = await wait(until.elementLocated(By.className("navbar-pc__icon--profile")));
        await wait(until.elementIsVisible(profileIcon));
        const actions = driver.actions({ async: true });
        await actions.move({ origin: profileIcon }).perform();

        const profileNameElement = await wait(until.elementLocated(By.className("profile-menu__name")));
        const profileName = await profileNameElement.getText();

        await actions.move({ x: 0, y: 0 }).perform();

        for (const deliveryItem of deliveryItems) {
          const status = await deliveryItem.findElement(By.className("goods-list-delivery__price-status")).getText();
          const address = await deliveryAddress.findElement(By.className("delivery-address__info")).getText();

          const photo = await deliveryItem.findElement(By.className("goods-list-delivery__photo"));
          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", photo);
          await driver.sleep(SECOND * 2);
          await photo.click();

          const vendorCodeElement = await wait(until.elementLocated(By.id("productNmId")));

          let sizeElement = null;
          try {
            sizeElement = await driver.findElement(By.css(".j-size.active .sizes-list__size"));
          } catch {}

          let sizeRuElement = null;
          try {
            sizeRuElement = await driver.findElement(By.css(".j-size.active .sizes-list__size-ru"));
          } catch {}

          await driver.sleep(SECOND * 2);
          const vendorCode = await vendorCodeElement.getText();
          const size = sizeElement ? await sizeElement.getText() : "";
          const sizeRu = sizeRuElement ? await sizeRuElement.getText() : "";
          const close = await wait(until.elementLocated(By.className("popup__close")));

          await driver.sleep(SECOND * 3);

          await close.click();
          await driver.sleep(SECOND * 2);

          yield new DeliveryItemNotification("Found delivery item", {
            phone,
            profileName,
            size,
            sizeRu,
            address,
            code,
            status,
            vendorCode,
          });
        }
      }
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }
}
