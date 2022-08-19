const path = require("path");
const {findEnvFile} = require("./../libs/env");
const dotenv = require("dotenv");
dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

const {login} = require("../app/usecase/login");
const {container} = require("../app/service-container");

(async () => {
  let driver;

  try {
    driver = container.get("selenium-webdriver");

    await login("79309663292");

    driver.quit();
  } catch (e) {
    console.log(e);
    driver?.quit();
  }
})();
