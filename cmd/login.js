const path = require("path");
const {findEnvFile} = require("./../libs/env");
const dotenv = require("dotenv");
dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

const {login} = require("../app/usecase/login");
const {seleniumWebdriver: driver} = require("../app/service/selenium-webdriver");

(async () => {
  try {
    await login();
  } catch (e) {
    console.log(e);
  } finally {
    driver.quit();
  }
})();
