import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export type Gender = "man" | "woman";

export interface LoginParams extends BrowserParams, ScreencastParams {
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
