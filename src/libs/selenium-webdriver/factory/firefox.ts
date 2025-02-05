import "geckodriver";
import firefox from "selenium-webdriver/firefox";
import { Builder } from "selenium-webdriver";
import type { DriverFactory, FirefoxDriverOptions } from "../types";
import type { ThenableWebDriver } from "selenium-webdriver";

export class FirefoxDriverFactory implements DriverFactory {
  constructor(readonly options: FirefoxDriverOptions) {
    this.options = options;
  }

  create(): ThenableWebDriver {
    const { headless, windowSize } = this.options;
    const builder = new Builder();
    const options = new firefox.Options();

    if (headless) {
      options.headless()
    }

    if (windowSize) {
      options.windowSize(windowSize);
    }

    builder.forBrowser("firefox");
    builder.setFirefoxOptions(options);

    return builder.build();
  }
}
