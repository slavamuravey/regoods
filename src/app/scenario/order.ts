import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export interface OrderParams extends BrowserParams {
  phone: string;
}

export interface OrderScenario {
  order(params: OrderParams): AsyncGenerator<StepMessage>;
}
