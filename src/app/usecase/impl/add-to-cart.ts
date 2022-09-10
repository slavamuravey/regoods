import { createStepMessage, getCookies } from "../utils";
import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import { AddToCartParams, AddToCartUsecase, AddToCartUsecaseError } from "../add-to-cart";
import { By, Key, ThenableWebDriver } from "selenium-webdriver";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { StepMessage } from "../step-message";
import _ from "lodash";

export class AddToCartUsecaseImpl implements AddToCartUsecase {
  constructor(readonly wbUserSessionRepository: WbUserSessionRepository) {
    this.wbUserSessionRepository = wbUserSessionRepository;
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

    const driver = createDriver(browser, { headless, proxy, userAgent });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Open main page");

      const cookies = wbUserSession.cookies;

      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Open main page as logged in user");

      const basketButton = driver.findElement(By.className("j-item-basket"));
      await basketButton.click();
      await driver.sleep(_.random(SECOND * 2, SECOND * 4));
      yield createStepMessage("Click basket button");

      while (true) {
        let removeItemButton = null;

        try {
          removeItemButton = await driver.findElement(By.className("btn__del"));
        } catch {
        }

        if (removeItemButton === null) {
          break;
        }

        await removeItemButton.click();
        await driver.sleep(_.random(SECOND, SECOND * 2));
        yield createStepMessage("Remove item from the cart");
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Open main page after clean basket");

      if (typeof address === "string") {
        yield* this.chooseAddress(driver, address);

        const cookies = await getCookies(driver);

        await wbUserSessionRepository.update(sessionId, { cookies });
      }

      const searchInput = driver.findElement(By.id("searchInput"));
      await searchInput.sendKeys(keyPhrase);
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Send key phrase keys to search input");

      await searchInput.sendKeys(Key.RETURN);
      await driver.sleep(_.random(SECOND * 5, SECOND * 10));
      yield createStepMessage("Get search results");

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
          yield createStepMessage(`Open item with vendor code "${vendorCode}"`);
          break;
        }

        let nextPageLink = null;

        try {
          nextPageLink = await driver.findElement(By.className("pagination__next"));
        } catch {
        }

        if (nextPageLink === null) {
          throw new AddToCartUsecaseError(`product with vendor code "${vendorCode}" is not found.`);
        }

        const footer = await driver.findElement(By.css("footer"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", footer);
        await driver.sleep(_.random(SECOND, SECOND * 2));

        const pager = await driver.findElement(By.className("pager-bottom"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", pager);
        await driver.sleep(_.random(SECOND, SECOND * 2));

        await nextPageLink.click();
        await driver.sleep(_.random(SECOND * 2, SECOND * 4));
        yield createStepMessage("Click next page link");
      }

      if (typeof size === "string") {
        yield* this.chooseSize(driver, size);
      }

      const detailsHeader = driver.findElement(By.className("details-section__header"));
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", detailsHeader);
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield createStepMessage("Scroll to details section");

      const openCharacteristicsButton = driver.findElement(By.className("collapsible__toggle"));
      await openCharacteristicsButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Open characteristics");

      const addToCartButton = driver.findElement(By.css("a.btn-main"));
      await addToCartButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click add to cart button");

      const cartButton = driver.findElement(By.css("a.btn-base"));
      await cartButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click cart button");

      let choosePayButton = null;

      try {
        choosePayButton = await driver.findElement(By.className("basket-pay__choose-pay"));
      } catch {
      }

      if (choosePayButton === null) {
        choosePayButton = await driver.findElement(By.css(".basket-pay .btn-edit"));
      }

      await choosePayButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click choose pay method button");

      const qrMethodButton = driver.findElement(By.className("icon-qrc"));
      await qrMethodButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click QR pay method button");

      const popupChooseButton = driver.findElement(By.className("popup__btn-main"));
      await popupChooseButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click popup choose button");

      const doOrderButton = driver.findElement(By.className("b-btn-do-order"));
      await doOrderButton.click();
      await driver.sleep(_.random(SECOND, SECOND * 2));
      yield createStepMessage("Click do order button");
    } finally {
      if (quit) {
        driver.quit();
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
      throw new AddToCartUsecaseError(`size "${size}" is not found.`);
    }

    await sizeButton.click();
    await driver.sleep(_.random(SECOND * 3, SECOND * 6));
    yield createStepMessage(`Choose size "${size}"`);
  }

  async* chooseAddress(driver: ThenableWebDriver, address: string) {
    const addressLink = driver.findElement(By.className("simple-menu__link--address"));
    await addressLink.click();
    await driver.sleep(_.random(SECOND * 3, SECOND * 6));
    yield createStepMessage("Click address link");

    const addressInput = driver.findElement(By.css("input[class*='searchbox-input__input']"));
    await addressInput.sendKeys(address);
    await driver.sleep(_.random(SECOND, SECOND * 2));
    yield createStepMessage("Send address to address input");

    await addressInput.sendKeys(Key.RETURN);
    await driver.sleep(_.random(SECOND * 5, SECOND * 10));
    yield createStepMessage("Get suggested addresses");

    let addressDropdownFirstItem = null;

    try {
      addressDropdownFirstItem = await driver.findElement(By.css("*[class$='islets_serp-popup']:not(*[class$='islets__hidden']) *[class$='islets__first']"));
    } catch {
    }

    if (addressDropdownFirstItem !== null) {
      await addressDropdownFirstItem.click();
      await driver.sleep(_.random(SECOND * 3, SECOND * 6));
      yield createStepMessage("Click dropdown first address item");
    }

    let addressItem = null;

    try {
      addressItem = await driver.findElement(By.xpath(`//span[text()='${address}']`));
    } catch {
    }

    if (addressItem === null) {
      throw new AddToCartUsecaseError(`address "${address}" is not found.`);
    }

    await addressItem.click();
    await driver.sleep(_.random(SECOND * 2, SECOND * 4));
    yield createStepMessage("Click address item");

    const chooseAddressButton = driver.findElement(By.className("balloon-content-block-btn"));

    if (await chooseAddressButton.getAttribute("disabled") === "true") {
      const closeButton = driver.findElement(By.className("popup__close-btn"));
      await closeButton.click();
    } else {
      await chooseAddressButton.click();
    }

    await driver.sleep(_.random(SECOND * 2, SECOND * 4));
    yield createStepMessage("Choose address");
  }
}
