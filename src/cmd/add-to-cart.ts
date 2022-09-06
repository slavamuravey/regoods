import { Command, Option } from "commander";
import { container } from "../app/service-container";
import type { AddToCartUsecase } from "../app/usecase/add-to-cart";
import { AddToCartUsecaseError } from "../app/usecase/add-to-cart";
import type { StepMessage } from "../app/usecase/step-message";

export const addToCartCmd = new Command();

addToCartCmd
  .name("add-to-cart")
  .description("put the item in the cart")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--vendor-code <string>", "the vendor code of the product").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--key-phrase <string>", "the key phrase to find the product").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--size <string>", "the size of product").makeOptionMandatory(true)
  )
  .addOption(new Option("--no-size", "do not choose size"))
  .addOption(
    new Option("--address <string>", "the address of the the issue point").makeOptionMandatory(true)
  )
  .addOption(new Option("--no-address", "do not choose address"))
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
    const addToCartUsecase: AddToCartUsecase = container.get("add-to-cart-usecase");

    const addToCartGenerator: AsyncGenerator<StepMessage> = addToCartUsecase.addToCart({
      phone,
      vendorCode,
      keyPhrase,
      size,
      address,
      browser,
      proxy,
      headless,
      quit
    });

    try {
      for await (const msg of addToCartGenerator) {
        console.log({
          ...msg,
          screenshot: msg.screenshot?.slice(-10)
        });
      }
    } catch (e) {
      if (e instanceof AddToCartUsecaseError) {
        console.log(e);

        return;
      }

      console.log("internal error: ", e);
    }
  });
