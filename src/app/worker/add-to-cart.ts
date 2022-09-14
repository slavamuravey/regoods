import { container } from "../service-container";
import { AddToCartUsecaseError } from "../usecase/add-to-cart";
import type { AddToCartUsecase } from "../usecase/add-to-cart";
import type { StepMessage } from "../usecase/step-message";

process.on("message", async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
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
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof AddToCartUsecaseError) {
      console.error(e);

      return;
    }

    console.error("internal error: ", e);
  } finally {
    process.exit();
  }
});