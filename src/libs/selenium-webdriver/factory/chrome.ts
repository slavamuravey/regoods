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
    const { headless, proxy, userAgent } = this.options;
    const builder = new Builder();
    const options = new chrome.Options();

    if (headless) {
      options.headless()
    }

    if (proxy) {
      options.addArguments(`--proxy-server=${proxy}`);
    }

    if (userAgent) {
      options.addArguments(`--user-agent=${userAgent}`);
    }

    options.addArguments("--no-sandbox");
    options.addArguments("--start-maximized");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--disable-infobars");
    options.excludeSwitches("enable-automation");
    options.excludeSwitches("enable-logging");

    builder.forBrowser("chrome");
    builder.setChromeOptions(options);

    return builder.build();
  }
}