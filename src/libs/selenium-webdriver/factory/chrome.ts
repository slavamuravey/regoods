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
    const { headless, proxy, userAgent, windowSize } = this.options;
    const builder = new Builder();
    const options = new chrome.Options();

    options.get("goog:chromeOptions").useAutomationExtension = false;

    if (headless) {
      options.headless()
    }

    if (proxy) {
      options.addArguments(`--proxy-server=${proxy}`);
    }

    if (userAgent) {
      options.addArguments(`--user-agent=${userAgent}`);
    }

    if (windowSize) {
      options.windowSize(windowSize);
    }

    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--disable-infobars");
    options.excludeSwitches("enable-automation");
    options.excludeSwitches("enable-logging");

    builder.forBrowser("chrome");
    builder.setChromeOptions(options);

    const driver = builder.build();

    (async () => {
      // const caps = await driver.getCapabilities();
      // console.log(caps.get("goog:chromeOptions").debuggerAddress);

      const connection = await driver.createCDPConnection("page");

      await connection.execute("Page.enable", {}, null);
      await connection.execute("Page.addScriptToEvaluateOnNewDocument", {
        source: `
            Object.defineProperty(navigator, "plugins", {
              get: () => [1, 2, 3, 4, 5]
            });
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
              parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
            );
            window.chrome = {
              runtime: {}
            };
          `
      });
    })();

    return driver;
  }
}