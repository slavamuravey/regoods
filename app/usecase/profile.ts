import { SECOND } from "../../libs/time";
import path from "path";
import { createSnapshot, createSnapshotDirPath } from "../utils/utils";
import { container } from "../service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { WbUserRepository } from "../repository/types";
import type { ProfileParams } from "./types";

export async function profile(params: ProfileParams) {
  const driver: ThenableWebDriver = container.get("selenium-webdriver");
  const wbUserRepository: WbUserRepository = container.get("wb-user-repository");

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
