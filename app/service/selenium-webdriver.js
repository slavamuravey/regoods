require("chromedriver");
const {Builder} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");

const screen = {
  width: 1920,
  height: 1080
};

const driver = new Builder()
  .forBrowser("chrome")
  // .setChromeOptions(new chrome.Options().windowSize(screen).addArguments(`--proxy-server=http://${proxyAddress}`))
  // .setFirefoxOptions(new firefox.Options().windowSize(screen).addArguments(`--proxy-server=http://${proxyAddress}`))
  .setChromeOptions(new chrome.Options().windowSize(screen))
  .setFirefoxOptions(new firefox.Options().windowSize(screen))
  // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
  // .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
  .build();

module.exports = {
  seleniumWebdriver: driver
}