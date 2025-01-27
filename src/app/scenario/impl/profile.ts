import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProfileParams, ProfileScenario } from "../profile";
import type { StepMessage } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import _ from "lodash";
import { BrowserActionNotification, DebuggerAddressNotification } from "../step-message";

export class ProfileScenarioImpl implements ProfileScenario {
  constructor(readonly wbUserSessionRepository: WbUserSessionRepository, readonly proxyResolver: ProxyResolver) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.proxyResolver = proxyResolver;
  }

  async* profile({ phone, browser, proxy, headless, quit}: ProfileParams): AsyncGenerator<StepMessage> {
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
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Open main page");

      const cookies = wbUserSession.cookies;

      for (const cookie of cookies) {
        if (![".wildberries.ru", "www.wildberries.ru"].includes(cookie.domain as string)) {
          continue;
        }
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru/lk");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Open profile page");
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }
}
