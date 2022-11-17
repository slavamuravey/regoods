import type { StepMessage } from "./step-message";
import type { BrowserParams, ScreencastParams } from "./params";

export interface KeyPhraseParams extends BrowserParams, ScreencastParams {
  phone: string;
  keyPhrase: string;
}

export interface KeyPhraseUsecase {
  keyPhrase(params: KeyPhraseParams): AsyncGenerator<StepMessage>;
}

export class KeyPhraseUsecaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
