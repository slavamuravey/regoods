import { StepMessage } from "./step-message";

export type Gender = "man" | "woman";

export interface LoginParams {
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
