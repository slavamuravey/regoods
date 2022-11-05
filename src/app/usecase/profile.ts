import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export interface ProfileParams extends BrowserParams {
  phone: string;
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
