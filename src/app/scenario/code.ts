import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export interface CodeParams extends BrowserParams {
  phone: string;
}

export interface CodeScenario {
  code(params: CodeParams): AsyncGenerator<StepMessage>;
}
