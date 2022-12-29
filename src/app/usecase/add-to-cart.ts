import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export interface AddToCartParams extends BrowserParams, ScreencastParams {
  phone: string;
  vendorCode: string;
  keyPhrase: string;
  size: string | boolean;
  address: string | boolean;
}

export interface AddToCartUsecase {
  addToCart(params: AddToCartParams): AsyncGenerator<StepMessage>;
}
