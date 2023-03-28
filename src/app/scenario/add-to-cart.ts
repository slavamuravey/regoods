import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export interface AddToCartParams extends BrowserParams {
  phone: string;
  vendorCode: string;
  keyPhrase: string;
  size: string | boolean;
  address: string | boolean;
}

export interface AddToCartScenario {
  addToCart(params: AddToCartParams): AsyncGenerator<StepMessage>;
}
