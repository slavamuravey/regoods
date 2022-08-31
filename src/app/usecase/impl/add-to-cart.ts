import { createStepMessage } from "../utils";
import { Click, Get, SendKeys } from "../actions";
import { SECOND } from "../../../libs/time";
import { createDriver } from "../../../libs/selenium-webdriver";
import { AddToCartParams, AddToCartUsecase, AddToCartUsecaseError } from "../add-to-cart";
import { By, Key, until } from "selenium-webdriver";
import type { WbUserRepository } from "../../repository/wb-user";
import type { StepMessage } from "../step-message";

export class AddToCartUsecaseImpl implements AddToCartUsecase {
  constructor(readonly wbUserRepository: WbUserRepository) {
    this.wbUserRepository = wbUserRepository;
  }

  async* addToCart({
                     wbUserId,
                     vendorCode,
                     keyPhrase,
                     size,
                     address,
                     browser,
                     headless,
                     quit
                   }: AddToCartParams): AsyncGenerator<StepMessage> {
    const wbUserRepository = this.wbUserRepository;

    const driver = createDriver(browser, { headless });

    try {
      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page", await driver.takeScreenshot());

      const wbUser = await wbUserRepository.find(wbUserId);
      const cookies = wbUser.cookies;

      if (!cookies) {
        throw new Error(`no cookies for user "${wbUserId}".`);
      }

      for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page as logged in user", await driver.takeScreenshot());

      const basketButton = driver.findElement(By.className("j-item-basket"));
      await basketButton.click();
      await driver.sleep(SECOND * 2);
      yield createStepMessage(new Click(), "Click basket button", await driver.takeScreenshot());

      while (true) {
        let removeItemButton = null;

        try {
          removeItemButton = await driver.findElement(By.className("btn__del"));
        } catch {}

        if (removeItemButton === null) {
          break;
        }

        await removeItemButton.click();
        await driver.sleep(SECOND);
        yield createStepMessage(new Click(), "Remove item from the cart", await driver.takeScreenshot());
      }

      await driver.get("https://www.wildberries.ru");
      await driver.sleep(SECOND);
      yield createStepMessage(new Get("https://www.wildberries.ru"), "Open main page after clean basket", await driver.takeScreenshot());

      const addressLink = driver.findElement(By.className("simple-menu__link--address"));
      await addressLink.click();
      await driver.sleep(SECOND * 3);
      yield createStepMessage(new Click(), "Click address link", await driver.takeScreenshot());

      const addressInput = driver.findElement(By.css("input[class*='searchbox-input__input']"));
      await addressInput.sendKeys(address);
      await driver.sleep(SECOND);
      yield createStepMessage(new SendKeys(address), "Send address to address input", await driver.takeScreenshot());

      await addressInput.sendKeys(Key.RETURN);
      await driver.sleep(SECOND * 5);
      yield createStepMessage(new SendKeys(Key.RETURN), "Get suggested addresses", await driver.takeScreenshot());

      let addressItem = null;

      try {
        addressItem = await driver.findElement(By.xpath(`//span[text()='${address}']`));
      } catch {}

      if (addressItem === null) {
        throw new AddToCartUsecaseError(`address "${address}" is not found.`);
      }

      await addressItem.click();
      await driver.sleep(SECOND * 2);
      yield createStepMessage(new Click(), "Click address item", await driver.takeScreenshot());

      const chooseAddressButton = driver.findElement(By.className("balloon-content-block-btn"));
      await chooseAddressButton.click();
      await driver.sleep(SECOND * 2);
      yield createStepMessage(new Click(), "Choose address", await driver.takeScreenshot());

      const searchInput = driver.findElement(By.id("searchInput"));
      await searchInput.sendKeys(keyPhrase);
      await driver.sleep(SECOND);
      yield createStepMessage(new SendKeys(keyPhrase), "Send key phrase keys to search input", await driver.takeScreenshot());

      await searchInput.sendKeys(Key.RETURN);
      await driver.sleep(SECOND * 5);
      yield createStepMessage(new SendKeys(Key.RETURN), "Get search results", await driver.takeScreenshot());

      while (true) {
        let item = null;

        try {
          item = await driver.findElement(By.id(`c${vendorCode}`));
        } catch {}

        if (item !== null) {
          await item.click();
          await driver.sleep(SECOND * 2);
          yield createStepMessage(new Click(), `Open item with vendor code "${vendorCode}"`, await driver.takeScreenshot());
          break;
        }

        let nextPageLink = null;

        try {
          nextPageLink = await driver.findElement(By.className("pagination__next"));
        } catch {}

        if (nextPageLink === null) {
          throw new AddToCartUsecaseError(`product with vendor code "${vendorCode}" is not found.`);
        }

        await nextPageLink.click();
        await driver.sleep(SECOND * 2);
        yield createStepMessage(new Click(), "Click next page link", await driver.takeScreenshot());
      }

      let sizeButton = null;

      try {
        sizeButton = await driver.findElement(By.xpath(`//span[contains(@class, 'sizes-list__size') and text()='${size}']`));
      } catch {}

      if (sizeButton === null) {
        throw new AddToCartUsecaseError(`size "${size}" is not found.`);
      }

      await sizeButton.click();
      await driver.sleep(SECOND * 3);
      yield createStepMessage(new Click(), `Choose size "${size}"`, await driver.takeScreenshot());

      const detailsHeader = driver.findElement(By.className("details-section__header"));
      await driver.executeScript("arguments[0].scrollIntoView(true);", detailsHeader);
      await driver.sleep(SECOND * 3);
      yield createStepMessage(new Click(), "Scroll to details section", await driver.takeScreenshot());

      const openCharacteristicsButton = driver.findElement(By.className("collapsible__toggle"));
      await openCharacteristicsButton.click();
      await driver.sleep(SECOND);
      yield createStepMessage(new Click(), "Open characteristics", await driver.takeScreenshot());

      const addToCartButton = driver.findElement(By.css("a.btn-main"));
      await addToCartButton.click();
      await driver.sleep(SECOND);
      yield createStepMessage(new Click(), "Click add to cart button", await driver.takeScreenshot());
    } finally {
      if (quit) {
        driver.quit();
      }
    }
  }
}
