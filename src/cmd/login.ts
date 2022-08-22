import { ROOT_DIR } from "../settings";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(ROOT_DIR, process.env.NODE_ENV) });

import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { LoginUsecase } from "../app/usecase/login";

(async () => {
  const driver: ThenableWebDriver = container.get("selenium-webdriver");
  const loginUsecase: LoginUsecase = container.get("login-usecase");

  try {
    await loginUsecase.login({ gender: "man" });
    driver.quit();
  } catch (e) {
    console.log(e);
    driver.quit();
  }
})();
