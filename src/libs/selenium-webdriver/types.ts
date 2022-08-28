import { ThenableWebDriver } from "selenium-webdriver";

export interface DriverOptions {
  headless?: boolean;
  screen?: {
    width: number;
    height: number;
  }
}

export interface DriverFactory {
  create(): ThenableWebDriver
}

export interface ChromeDriverOptions extends DriverOptions {}
export interface FirefoxDriverOptions extends DriverOptions {}