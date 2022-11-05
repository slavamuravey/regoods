import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export interface CodeParams extends BrowserParams, ScreencastParams {
  phone: string;
}

export interface CodeUsecase {
  code(params: CodeParams): AsyncGenerator<StepMessage>;
}

export class CodeUsecaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
