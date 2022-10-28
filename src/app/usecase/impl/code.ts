import { SECOND } from "../../../libs/time";
import type { CodeParams, CodeUsecase } from "../code";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { StepMessage } from "../step-message";
import { BrowserActionNotification, DebuggerAddressNotification, DeliveryItemNotification } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import { By, until } from "selenium-webdriver";
import { createWait } from "../utils";
import _ from "lodash";

export class CodeUsecaseImpl implements CodeUsecase {
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
    const wait = createWait(driver, SECOND * 30);

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

      const cookies = wbUserSession.cookies;

      for (const cookie of cookies) {
        if (![".wildberries.ru", "www.wildberries.ru"].includes(cookie.domain as string)) {
          continue;
        }
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru/lk/myorders/delivery");
      await driver.sleep(_.random(SECOND * 2, SECOND * 3));
      yield new BrowserActionNotification("Open delivery page");

      const deliveryAddresses = await driver.findElements(By.className("delivery-block__content"));

      for (const deliveryAddress of deliveryAddresses) {
        let code;

        try {
          code = await deliveryAddress.findElement(By.className("delivery-code__value")).getText();
        } catch {
          continue;
        }

        const deliveryItems = await deliveryAddress.findElements(By.className("goods-list-delivery__item"));

        for (const deliveryItem of deliveryItems) {
          const status = await deliveryItem.findElement(By.className("goods-list-delivery__price-status")).getText();
          const address = await deliveryAddress.findElement(By.className("delivery-address__info")).getText();

          const photo = await deliveryItem.findElement(By.className("goods-list-delivery__photo"));
          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", photo);
          await driver.sleep(_.random(SECOND, SECOND * 2));
          await photo.click();

          const vendorCodeElement = await wait(until.elementLocated(By.id("productNmId")));
          await driver.sleep(_.random(SECOND, SECOND * 2));
          const vendorCode = await vendorCodeElement.getText();
          const close = await wait(until.elementLocated(By.className("popup__close")));

          await driver.sleep(_.random(SECOND * 2, SECOND * 3));

          await close.click();
          await driver.sleep(_.random(SECOND, SECOND * 2));

          yield new DeliveryItemNotification("Found delivery item", {
            phone,
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
