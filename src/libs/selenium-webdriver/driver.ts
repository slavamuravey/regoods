import type { ThenableWebDriver } from "selenium-webdriver";
import type { DriverOptions } from "./types";
import { ChromeDriverFactory } from "./factory/chrome";
import { FirefoxDriverFactory } from "./factory/firefox";

export function createDriver(browser: "chrome" | "firefox", options: DriverOptions): ThenableWebDriver {
  const driverFactory = browser === "firefox" ? new FirefoxDriverFactory(options) : new ChromeDriverFactory(options)

  return driverFactory.create();
}
