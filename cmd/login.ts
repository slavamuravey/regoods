import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import type { LoginUsecase } from "../app/usecase/login";
import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";

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
