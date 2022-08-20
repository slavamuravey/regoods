import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import { lk } from "../app/usecase/lk";
import { container } from "../app/service-container";

(async () => {
  let driver;

  try {
    driver = container.get("selenium-webdriver");

    await lk("79309663292");

    driver.quit();
  } catch (e) {
    console.log(e);
    driver?.quit();
  }
})();
