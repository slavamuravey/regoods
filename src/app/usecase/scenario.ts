import { CodeUsecase } from "./code";
import { container } from "../service-container";
import { StepMessage } from "./step-message";
import { AddToCartUsecase } from "./add-to-cart";
import { KeyPhraseUsecase } from "./key-phrase";
import { LoginParams, LoginUsecase } from "./login";

export enum Scenario {
  Code = "code",
  AddToCart = "add-to-cart",
  KeyPhrase = "key-phrase",
  Login = "login"
}

export const scenarioGeneratorFactories = new Map<Scenario, (params: any) => AsyncGenerator<StepMessage>>();

scenarioGeneratorFactories.set(Scenario.Code, (params: any) => {
  const scenario: CodeUsecase = container.get("code-usecase");
  const { phone, browser, proxy, headless, quit } = params;

  return scenario.code({ phone, browser, proxy, headless, quit });
});

scenarioGeneratorFactories.set(Scenario.AddToCart, (params: any) => {
  const scenario: AddToCartUsecase = container.get("add-to-cart-usecase");
  const {
    phone,
    vendorCode,
    keyPhrase,
    size,
    address,
    browser,
    proxy,
    headless,
    quit
  } = params;

  return scenario.addToCart({
    phone,
    vendorCode,
    keyPhrase,
    size,
    address,
    browser,
    proxy,
    headless,
    quit
  });
});

scenarioGeneratorFactories.set(Scenario.KeyPhrase, (params: any) => {
  const scenario: KeyPhraseUsecase = container.get("key-phrase-usecase");
  const { phone, keyPhrase, browser, proxy, headless, quit } = params;

  return scenario.keyPhrase({ phone, keyPhrase, browser, proxy, headless, quit });
});

scenarioGeneratorFactories.set(Scenario.Login, (params: any) => {
  const scenario: LoginUsecase = container.get("login-usecase");

  const {
    browser,
    proxy,
    userAgent,
    headless,
    quit,
    phone,
    gender,
  } = params;

  const loginParams: LoginParams = {
    browser,
    proxy,
    userAgent,
    headless,
    quit
  }

  if (phone) {
    loginParams.phone = phone;
  }

  if (gender) {
    loginParams.gender = gender;
  }

  return scenario.login(loginParams);
});
