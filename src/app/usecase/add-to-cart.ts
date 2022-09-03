import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./browser-params";

export interface AddToCartParams extends BrowserParams {
  wbUserId: string;
  vendorCode: string;
  keyPhrase: string;
  size: string | boolean;
  address: string | boolean;
}

export interface AddToCartUsecase {
  addToCart(params: AddToCartParams): AsyncGenerator<StepMessage>;
}

export class AddToCartUsecaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
