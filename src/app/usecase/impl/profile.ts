import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProfileParams, ProfileUsecase } from "../profile";
import type { StepMessage } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import _ from "lodash";
import { BrowserActionNotification, DebuggerAddressNotification } from "../step-message";

export class ProfileUsecaseImpl implements ProfileUsecase {
  constructor(readonly wbUserSessionRepository: WbUserSessionRepository, readonly proxyResolver: ProxyResolver) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.proxyResolver = proxyResolver;
  }

  async* profile({ phone, browser, proxy, headless, quit}: ProfileParams): AsyncGenerator<StepMessage> {
    const wbUserSessionRepository = this.wbUserSessionRepository;

    const wbUserSession = await wbUserSessionRepository.findOneByPhone(phone);

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

      const wbUser = await wbUserSessionRepository.findOneByPhone(phone);
      const cookies = wbUser.cookies;

      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru/lk");
      await driver.sleep(SECOND);
      yield new BrowserActionNotification("Open profile page");
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }
}
