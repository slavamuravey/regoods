import type { StepMessage } from "./step-message";

export interface ProfileParams {
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
