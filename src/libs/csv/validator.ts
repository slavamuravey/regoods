import type { FieldValidator } from "./parser";
import * as util from "util";

export class RequiredValidator implements FieldValidator {
  constructor(public readonly errorMessageTemplate = "The value is mandatory.") {}

  validate(value: any): boolean {
    return value != undefined;
  }

  getErrorMessage() {
    return this.errorMessageTemplate;
  }
}

export class NotEmptyValidator implements FieldValidator {
  constructor(public readonly errorMessageTemplate = "The value must not be empty.") {}

  validate(value: any): boolean {
    return !!value;
  }

  getErrorMessage() {
    return this.errorMessageTemplate;
  }
}

export class ChoiceValidator implements FieldValidator {
  constructor(private readonly choice: string[], public readonly errorMessageTemplate = "The value must be one of: %s.") {}

  validate(value: any): boolean {
    return this.choice.includes(value);
  }

  getErrorMessage() {
    return util.format(this.errorMessageTemplate, this.choice.join(", "));
  }
}