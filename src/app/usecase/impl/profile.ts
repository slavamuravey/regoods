import { createStepMessage } from "../utils";
import { Get } from "../actions";
import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProfileParams, ProfileUsecase } from "../profile";
import type { StepMessage } from "../step-message";
import _ from "lodash";

export class ProfileUsecaseImpl implements ProfileUsecase {
  constructor(readonly wbUserSessionRepository: WbUserSessionRepository) {
    this.wbUserSessionRepository = wbUserSessionRepository;
  }

  async* profile({ phone, browser, proxy, headless, quit}: ProfileParams): AsyncGenerator<StepMessage> {
    const wbUserSessionRepository = this.wbUserSessionRepository;

    const wbUserSession = await wbUserSessionRepository.findOneByPhone(phone);

    const { userAgent } = wbUserSession;

    const driver = createDriver(browser, { headless, proxy, userAgent });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page", await driver.takeScreenshot());

      const wbUser = await wbUserSessionRepository.findOneByPhone(phone);
      const cookies = wbUser.cookies;

      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru/lk");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru/lk"), "Open profile page", await driver.takeScreenshot());
    } finally {
      if (quit) {
        driver.quit();
      }
    }
  }
}
