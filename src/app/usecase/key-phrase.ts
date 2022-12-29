import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export interface KeyPhraseParams extends BrowserParams, ScreencastParams {
  phone: string;
  keyPhrase: string;
}

export interface KeyPhraseUsecase {
  keyPhrase(params: KeyPhraseParams): AsyncGenerator<StepMessage>;
}
