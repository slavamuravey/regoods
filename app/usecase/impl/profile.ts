import path from "path";
import { SECOND } from "../../../libs/time";
import { createSnapshot, createSnapshotDirPath } from "../../utils/utils";
import { ThenableWebDriver } from "selenium-webdriver";
import type { WbUserRepository } from "../../repository/wb-user";
import type { ProfileParams, ProfileUsecase } from "../profile";

export class ProfileUsecaseImpl implements ProfileUsecase {
  constructor(readonly driver: ThenableWebDriver, readonly wbUserRepository: WbUserRepository) {
    this.driver = driver;
    this.wbUserRepository = wbUserRepository;
  }

  async profile(params: ProfileParams): Promise<void> {
    const driver = this.driver;
    const wbUserRepository = this.wbUserRepository;

    await driver.get("https://www.wildberries.ru");

    const wbUser = await wbUserRepository.find(params.wbUserId);
    const cookies = wbUser.cookies;

    if (!cookies) {
      throw new Error(`no cookies for user "${params.wbUserId}".`);
    }

    for (const cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }

    await driver.get("https://www.wildberries.ru/lk");
    await driver.sleep(SECOND);

    const image = await driver.takeScreenshot();

    await createSnapshot(path.resolve(createSnapshotDirPath(), "profile.png"), image);
  }
}
