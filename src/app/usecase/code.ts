import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./browser-params";

export interface CodeParams extends BrowserParams {
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
