import { ThenableWebDriver } from "selenium-webdriver";

export interface DriverOptions {
  headless?: boolean;
  proxy?: string;
  userAgent?: string;
}

export interface DriverFactory {
  create(): ThenableWebDriver
}

export interface ChromeDriverOptions extends DriverOptions {}
export interface FirefoxDriverOptions extends DriverOptions {}