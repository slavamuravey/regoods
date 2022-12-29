import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export interface CodeParams extends BrowserParams, ScreencastParams {
  phone: string;
}

export interface CodeUsecase {
  code(params: CodeParams): AsyncGenerator<StepMessage>;
}
