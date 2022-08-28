import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./browser-params";

export interface ProfileParams extends BrowserParams {
  wbUserId: string;
}

export interface ProfileUsecase {
  profile(params: ProfileParams): AsyncGenerator<StepMessage>;
}

export class ProfileUsecaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
