import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./browser-params";

export type Gender = "man" | "woman";

export interface LoginParams extends BrowserParams {
  wbUserId?: string;
  gender?: Gender;
}

export interface LoginUsecase {
  login(params: LoginParams): AsyncGenerator<StepMessage>;
}

export class LoginUsecaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
