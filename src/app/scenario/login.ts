import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export type Gender = "man" | "woman";

export interface LoginParams extends BrowserParams {
  phone?: string;
  gender?: Gender;
  userAgent?: string;
}

export interface LoginScenario {
  login(params: LoginParams): AsyncGenerator<StepMessage>;
}
