import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import { login } from "../app/usecase/login";
import { container } from "../app/service-container";

(async () => {
  let driver;

  try {
    driver = container.get("selenium-webdriver");

    await login({ gender: "man" });

    driver.quit();
  } catch (e) {
    console.log(e);
    driver?.quit();
  }
})();
