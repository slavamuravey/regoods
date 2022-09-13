import { container } from "../service-container";
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
      process.send!({ msg, err: null });
    }
  } catch (err) {
    process.send!({ msg: null, err});
  }
});