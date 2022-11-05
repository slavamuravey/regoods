import {
  ChoiceValidator,
  DefaultTransformer,
  EmptyTransformer,
  FieldsConfig,
  NotEmptyValidator,
  TrueUndefinedTransformer
} from "../libs/csv";

export const addToCartFileFieldsConfig: FieldsConfig = {
  phone: {
    transformers: [],
    validators: [new NotEmptyValidator()]
  },
  vendorCode: {
    transformers: [],
    validators: [new NotEmptyValidator()]
  },
  keyPhrase: {
    transformers: [],
    validators: [new NotEmptyValidator()]
  },
  size: {
    transformers: [new EmptyTransformer()],
    validators: []
  },
  address: {
    transformers: [new EmptyTransformer()],
    validators: []
  },
  browser: {
    transformers: [new DefaultTransformer("chrome")],
    validators: [new ChoiceValidator(["chrome", "firefox"])]
  },
  proxy: {
    transformers: [new EmptyTransformer()],
    validators: []
  },
  headless: {
    transformers: [new TrueUndefinedTransformer()],
    validators: []
  },
  quit: {
    transformers: [new TrueUndefinedTransformer()],
    validators: []
  },
  screencast: {
    transformers: [new TrueUndefinedTransformer()],
    validators: []
  }
};
