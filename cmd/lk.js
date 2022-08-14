const path = require("path");
const {findEnvFile} = require("./../libs/env");
const dotenv = require("dotenv");
dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

const {lk} = require("../app/usecase/lk");
const {seleniumWebdriver: driver} = require("../app/service/selenium-webdriver");

(async () => {
  try {
    await lk("79033413952");
  } catch (e) {
    console.log(e);
  } finally {
    driver.quit();
  }
})();
