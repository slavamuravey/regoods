import type { ThenableWebDriver } from "selenium-webdriver";
import type { DriverOptions } from "./types";
import { ChromeDriverFactory } from "./factory/chrome";
import { FirefoxDriverFactory } from "./factory/firefox";

const FULL_HD_WINDOW_SIZE = {
  width: 1920,
  height: 1080
};

export function createDriver(browser: "chrome" | "firefox", options: DriverOptions): ThenableWebDriver {
  if (!options.windowSize) {
    options.windowSize = FULL_HD_WINDOW_SIZE;
  }

  const driverFactory = browser === "firefox" ? new FirefoxDriverFactory(options) : new ChromeDriverFactory(options)

  return driverFactory.create();
}
