import "chromedriver";
import { Builder, ThenableWebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class SeleniumWebdriverFactory implements ServiceFactory {
  create(container: Container): ThenableWebDriver {
    const screen = {
      width: 1920,
      height: 1080
    };

    return new Builder()
      .forBrowser("chrome")
      // .setChromeOptions(new chrome.Options().windowSize(screen).addArguments(`--proxy-server=http://${proxyAddress}`))
      // .setFirefoxOptions(new firefox.Options().windowSize(screen).addArguments(`--proxy-server=http://${proxyAddress}`))
      // .setChromeOptions(new chrome.Options().windowSize(screen))
      // .setFirefoxOptions(new firefox.Options().windowSize(screen))
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
      .build();
  }
}
