import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import { profile } from "../app/usecase/profile";
import { container } from "../app/service-container";

(async () => {
  let driver;

  try {
    driver = container.get("selenium-webdriver");

    await profile({ wbUserId: "79255566234" });

    driver.quit();
  } catch (e) {
    console.log(e);
    driver?.quit();
  }
})();
