import { SECOND } from "../../../libs/time";
import type { OrderParams, OrderScenario } from "../order";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { StepMessage } from "../step-message";
import { BrowserActionNotification, DebuggerAddressNotification, OrderItemNotification } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import { By } from "selenium-webdriver";
import { ScenarioError } from "../error";
import _ from "lodash";

export class OrderScenarioImpl implements OrderScenario {
  constructor(
    readonly wbUserSessionRepository: WbUserSessionRepository,
    readonly proxyResolver: ProxyResolver
  ) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.proxyResolver = proxyResolver;
  }

  async* order({ phone, browser, proxy, headless, quit }: OrderParams): AsyncGenerator<StepMessage> {
    const wbUserSession = await this.wbUserSessionRepository.findOneByPhone(phone);

    const { userAgent } = wbUserSession;

    const driver = createDriver(browser, {
      headless,
      proxy: proxy === undefined ? await this.proxyResolver.resolve() : proxy,
      userAgent
    });

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

      await driver.get("https://www.wildberries.ru/lk/myorders/archive");

      await driver.sleep(SECOND * 5);

      yield new BrowserActionNotification("Open orders page");

      const orderItems = await driver.findElements(By.className("archive-page__item"));

      for (const orderItem of orderItems) {
        const priceElement = await orderItem.findElement(By.className("archive-item__price"));
        const nameElement = await orderItem.findElement(By.className("archive-item__brand"));
        const vendorCodeElement = await orderItem.findElement(By.className("archive-item__img-wrap"));
        let sizeElement = null;
        try {
          sizeElement = await orderItem.findElement(By.className("archive-item__size"));
        } catch {}

        const price = (await priceElement.getText()).replace(/\D+/g, '');
        const name = await nameElement.getText();
        const vendorCode = await vendorCodeElement.getAttribute("data-popup-nm-id");
        const size = sizeElement ? await sizeElement.getText() : "";

        const actions = driver.actions({ async: true });
        await actions.move({ origin: orderItem }).perform();

        let orderDateElement = null;
        try {
          orderDateElement = await orderItem.findElement(By.css(".archive-item__order-date > span:last-child"));
        } catch {}
        let receiveDateElement = null;
        try {
          receiveDateElement = (await orderItem.findElement(By.className("archive-item__receive-date")).findElements(By.className("hide-mobile")))[1];
        } catch {}
        let statusElement = null;
        try {
          statusElement = await orderItem.findElement(By.className("archive-item__status"));
        } catch {}
        const orderDate = orderDateElement ? await orderDateElement.getText() : "";
        const receiveDate = receiveDateElement ? await receiveDateElement.getText() : "";
        const status = statusElement ? await statusElement.getText() : "";

        yield new OrderItemNotification("Found order item", {
          phone,
          vendorCode,
          name,
          price,
          size,
          orderDate,
          receiveDate,
          status,
        });
      }
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }
}
