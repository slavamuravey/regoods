import fs from "fs";
import * as csv from "fast-csv";

export interface InvalidRowError {
  field: string;
  reason: string;
}

export interface FieldTransformer<I = any, O = any> {
  transform(value: I): O;
}

export interface FieldValidator<O = any> {
  errorMessageTemplate: string;
  getErrorMessage(): string;
  validate(value: O): boolean;
}

export type FieldsConfig = Record<string, {
  transformers: FieldTransformer[],
  validators: FieldValidator[],
}>;

export async function parseCsvFile<I extends object, O extends object>(
  filePath: string,
  fieldsConfig: FieldsConfig
): Promise<O[]> {
  const result: O[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv.parse<I, O>({ headers: true, trim: true }))
      .transform((row: I) => {
        const transformedRow: Record<string, any> = {};

        for (let [field, value] of Object.entries(row)) {
          if (!fieldsConfig[field]) {
            continue;
          }

          for (const transformer of fieldsConfig[field].transformers) {
            value = transformer.transform(value);
          }

          transformedRow[field] = value;
        }

        return {
          ...row,
          ...transformedRow
        };
      })
      .validate((row, cb): void => {
        let isValid = true;
        const errors: InvalidRowError[] = [];

        for (let [field, value] of Object.entries(row)) {
          if (!fieldsConfig[field]) {
            continue;
          }

          for (const validator of fieldsConfig[field].validators) {
            if (!validator.validate(value)) {
              isValid = false;
              errors.push({
                field,
                reason: validator.getErrorMessage()
              });
            }
          }
        }

        if (isValid) {
          return cb(null, true);
        }

        return cb(null, false, errors.map(error => `"${error.field}": "${error.reason}"`).join(", "));
      })
      .on("error", error => reject(error))
      .on("data", row => result.push(row))
      .on("data-invalid", (row, rowNumber, reason) =>
        reject(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}] [reason=${reason}]`),
      )
      .on("end", (rowCount: number) => resolve(result));
  });
}
