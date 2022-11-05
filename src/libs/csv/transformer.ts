import type { FieldTransformer } from "./parser";

export class EmptyTransformer implements FieldTransformer {
  transform(value: string): string | boolean | undefined {
    if (value === "-") {
      return false;
    }

    if (value === "") {
      return undefined;
    }

    return value;
  }
}

export class DefaultTransformer implements FieldTransformer {
  constructor(private readonly defaultValue: any) {
  }

  transform(value: any): any {
    return value || this.defaultValue;
  }
}

export class TrueUndefinedTransformer implements FieldTransformer {
  transform(value: any): any {
    return value ? true : undefined;
  }
}

export class UpperTransformer implements FieldTransformer {
  transform(value: any): any {
    return value.toUpperCase();
  }
}