import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./browser-params";

export type Gender = "man" | "woman";

export interface LoginParams extends BrowserParams {
  phone?: string;
  gender?: Gender;
  userAgent?: string;
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
