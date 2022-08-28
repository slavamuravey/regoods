import "chromedriver";
import chrome from "selenium-webdriver/chrome";
import { Builder } from "selenium-webdriver";
import type { ChromeDriverOptions, DriverFactory } from "../types";
import type { ThenableWebDriver } from "selenium-webdriver";

export class ChromeDriverFactory implements DriverFactory {
  constructor(readonly options: ChromeDriverOptions) {
    this.options = options;
  }

  create(): ThenableWebDriver {
    const { headless, screen } = this.options;
    const builder = new Builder();
    const options = new chrome.Options();

    if (headless) {
      options.headless()
    }

    if (screen) {
      options.windowSize(screen);
    }

    builder.forBrowser("chrome");
    builder.setChromeOptions(options);

    return builder.build();
  }
}