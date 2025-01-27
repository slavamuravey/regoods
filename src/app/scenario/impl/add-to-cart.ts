import { getCookies } from "../utils";
import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import { AddToCartParams, AddToCartScenario } from "../add-to-cart";
import { By, Key, ThenableWebDriver } from "selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { StepMessage } from "../step-message";
import { BrowserActionNotification, DebuggerAddressNotification } from "../step-message";
import type { ProxyResolver } from "../../service/proxy-resolver";
import _ from "lodash";
import { ScenarioError } from "../error";

export class AddToCartScenarioImpl implements AddToCartScenario {
  constructor(readonly wbUserSessionRepository: WbUserSessionRepository, readonly proxyResolver: ProxyResolver) {
    this.wbUserSessionRepository = wbUserSessionRepository;
    this.proxyResolver = proxyResolver;
  }

  async* addToCart({
                     phone,
                     vendorCode,
                     keyPhrase,
                     size,
                     address,
                     browser,
                     proxy,
                     headless,
                     quit
                   }: AddToCartParams): AsyncGenerator<StepMessage> {
    const wbUserSessionRepository = this.wbUserSessionRepository;

    const wbUserSession = await wbUserSessionRepository.findOneByPhone(phone);

    const { userAgent, id: sessionId } = wbUserSession;

    const driver = createDriver(browser, {
      headless,
      proxy: proxy === undefined ? await this.proxyResolver.resolve() : proxy,
      userAgent
    });

    try {
      if (browser === "chrome") {
        const caps = await driver.getCapabilities();
        yield new DebuggerAddressNotification("Debugger address", {
          debuggerAddress: caps.get("goog:chromeOptions").debuggerAddress
        });
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Open main page");

      const cookies = wbUserSession.cookies;

      for (const cookie of cookies) {
        if (![".wildberries.ru", "www.wildberries.ru"].includes(cookie.domain as string)) {
          continue;
        }
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));

      try {
        await driver.findElement(By.className("j-item-profile"));
      } catch {
        throw new ScenarioError(`unable to login`);
      }

      yield new BrowserActionNotification("Open main page as logged in user");

      const addressElement = driver.findElement(By.className("simple-menu__link--address"));
      const addressElementText = await addressElement.getText()

      if (typeof address === "string" && address !== addressElementText) {
        yield* this.chooseAddress(driver, address);

        const cookies = await getCookies(driver);

        await wbUserSessionRepository.update(sessionId, phone, { cookies });
      }

      const searchInput = driver.findElement(By.id("searchInput"));
      await searchInput.sendKeys(keyPhrase);
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Send key phrase keys to search input");

      await searchInput.sendKeys(Key.RETURN);
      await driver.sleep(_.random(SECOND * 5, SECOND * 10));
      yield new BrowserActionNotification("Get search results");

      while (true) {
        let item = null;

        try {
          item = await driver.findElement(By.id(`c${vendorCode}`));
        } catch {
        }

        if (item !== null) {
          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", item);
          await driver.sleep(_.random(SECOND, SECOND * 2));

          await item.click();
          await driver.sleep(_.random(SECOND * 2, SECOND * 4));
          yield new BrowserActionNotification(`Open item with vendor code "${vendorCode}"`);
          break;
        }

        let nextPageLink = null;

        try {
          nextPageLink = await driver.findElement(By.className("pagination__next"));
        } catch {
        }

        if (nextPageLink === null) {
          throw new ScenarioError(`product with vendor code "${vendorCode}" is not found.`);
        }

        const footer = await driver.findElement(By.css("footer"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", footer);
        await driver.sleep(_.random(SECOND, SECOND * 2));

        const pager = await driver.findElement(By.className("pager-bottom"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", pager);
        await driver.sleep(_.random(SECOND, SECOND * 2));

        await nextPageLink.click();
        await driver.sleep(_.random(SECOND * 2, SECOND * 4));
        yield new BrowserActionNotification("Click next page link");
      }

      if (typeof size === "string") {
        yield* this.chooseSize(driver, size);
      }

      const detailsHeader = driver.findElement(By.className("details-section__header"));
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", detailsHeader);
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield new BrowserActionNotification("Scroll to details section");

      const openCharacteristicsButton = driver.findElement(By.className("collapsible__toggle"));
      await openCharacteristicsButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Open characteristics");

      const footer = driver.findElement(By.className("footer__container"));
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", footer);
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield new BrowserActionNotification("Scroll to footer");

      const addToCartButton = driver.findElement(By.css("a.btn-main"));
      await addToCartButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Click add to cart button");

      const cartButton = driver.findElement(By.css("a.btn-base"));
      await cartButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield new BrowserActionNotification("Click cart button");
    } finally {
      if (quit) {
        await driver.quit();
      }
    }
  }

  async* chooseSize(driver: ThenableWebDriver, size: string) {
    let sizeButton = null;

    try {
      sizeButton = await driver.findElement(By.xpath(`//span[contains(@class, 'sizes-list__size') and text()='${size}']`));
    } catch {
    }

    if (sizeButton === null) {
      throw new ScenarioError(`size "${size}" is not found.`);
    }

    await sizeButton.click();
    await driver.sleep(_.random(SECOND * 3, SECOND * 6));
    yield new BrowserActionNotification(`Choose size "${size}"`);
  }

  async* chooseAddress(driver: ThenableWebDriver, address: string) {
    const addressLink = driver.findElement(By.className("simple-menu__link--address"));
    await addressLink.click();
    await driver.sleep(_.random(SECOND * 3, SECOND * 6));
    yield new BrowserActionNotification("Click address link");

    const addressInput = driver.findElement(By.css("input[class*='searchbox-input__input']"));
    await addressInput.sendKeys(address);
    await driver.sleep(_.random(SECOND, SECOND * 2));
    yield new BrowserActionNotification("Send address to address input");

    await addressInput.sendKeys(Key.RETURN);
    await driver.sleep(_.random(SECOND * 5, SECOND * 10));
    yield new BrowserActionNotification("Get suggested addresses");

    let addressDropdownFirstItem = null;

    try {
      addressDropdownFirstItem = await driver.findElement(By.css("*[class$='islets_serp-popup']:not(*[class$='islets__hidden']) *[class$='islets__first']"));
    } catch {
    }

    if (addressDropdownFirstItem !== null) {
      await addressDropdownFirstItem.click();
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield new BrowserActionNotification("Click dropdown first address item");
    }

    let addressItem = null;

    try {
      addressItem = await driver.findElement(By.xpath(`//span[text()='${address}']`));
    } catch {
    }

    if (addressItem === null) {
      throw new ScenarioError(`address "${address}" is not found.`);
    }

    await addressItem.click();
    await driver.sleep(_.random(SECOND * 2, SECOND * 4));
    yield new BrowserActionNotification("Click address item");

    const chooseAddressButton = driver.findElement(By.className("balloon-content-block-btn"));

    if (await chooseAddressButton.getAttribute("disabled") === "true") {
      const closeButton = driver.findElement(By.className("popup__close-btn"));
      await closeButton.click();
    } else {
      await chooseAddressButton.click();
    }

    await driver.sleep(_.random(SECOND * 2, SECOND * 4));
    yield new BrowserActionNotification("Choose address");
  }
}
