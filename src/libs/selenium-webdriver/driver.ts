import type { ThenableWebDriver } from "selenium-webdriver";
import type { DriverOptions } from "./types";
import { ChromeDriverFactory } from "./factory/chrome";
import { FirefoxDriverFactory } from "./factory/firefox";

export function createDriver(browser: "chrome" | "firefox", options: DriverOptions): ThenableWebDriver {
  if (!options.screen) {
    options.screen = {
      width: 1920,
      height: 1080
    };
  }

  const driverFactory = browser === "firefox" ? new FirefoxDriverFactory(options) : new ChromeDriverFactory(options)

  return driverFactory.create();
}
