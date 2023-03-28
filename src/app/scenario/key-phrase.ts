import type { StepMessage } from "./step-message";
import type { BrowserParams } from "./params";

export interface KeyPhraseParams extends BrowserParams {
  phone: string;
  keyPhrase: string;
}

export interface KeyPhraseScenario {
  keyPhrase(params: KeyPhraseParams): AsyncGenerator<StepMessage>;
}
