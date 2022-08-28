import type { WbUserRepository } from "../../repository/wb-user";
import type { ProfileParams, ProfileUsecase } from "../profile";
import type { StepMessage } from "../step-message";
import { createStepMessage } from "../utils";
import { Get } from "../actions";
import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";

export class ProfileUsecaseImpl implements ProfileUsecase {
  constructor(readonly wbUserRepository: WbUserRepository) {
    this.wbUserRepository = wbUserRepository;
  }

  async* profile(params: ProfileParams): AsyncGenerator<StepMessage> {
    const wbUserRepository = this.wbUserRepository;

    const { wbUserId, browser, headless} = params;

    const driver = createDriver(browser, { headless });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page", await driver.takeScreenshot());

      const wbUser = await wbUserRepository.find(wbUserId);
      const cookies = wbUser.cookies;

      if (!cookies) {
        throw new Error(`no cookies for user "${wbUserId}".`);
      }

      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru/lk");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru/lk"), "Open profile page", await driver.takeScreenshot());
    } finally {
      driver.quit();
    }
  }
}