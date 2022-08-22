import { ROOT_DIR } from "../settings";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(ROOT_DIR, process.env.NODE_ENV) });

import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { ProfileUsecase } from "../app/usecase/profile";

(async () => {
  const driver: ThenableWebDriver = container.get("selenium-webdriver");
  const profileUsecase: ProfileUsecase = container.get("profile-usecase");

  try {
    await profileUsecase.profile({ wbUserId: "79255566234" });
    driver.quit();
  } catch (e) {
    console.log(e);
    driver.quit();
  }
})();
