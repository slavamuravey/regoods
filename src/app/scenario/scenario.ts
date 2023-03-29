import { CodeScenario } from "./code";
import { container } from "../service-container";
import { StepMessage } from "./step-message";
import { AddToCartScenario } from "./add-to-cart";
import { KeyPhraseScenario } from "./key-phrase";
import { LoginParams, LoginScenario } from "./login";
import { OrderScenario } from "./order";

export enum Scenario {
  Code = "code",
  AddToCart = "add-to-cart",
  KeyPhrase = "key-phrase",
  Login = "login",
  Order = "order",
}

export const scenarioGeneratorFactories = new Map<Scenario, (params: any) => AsyncGenerator<StepMessage>>();

scenarioGeneratorFactories.set(Scenario.Order, (params: any) => {
  const scenario: OrderScenario = container.get("order-scenario");
  const { phone, browser, proxy, headless, quit } = params;

  return scenario.order({ phone, browser, proxy, headless, quit });
});

scenarioGeneratorFactories.set(Scenario.Code, (params: any) => {
  const scenario: CodeScenario = container.get("code-scenario");
  const { phone, browser, proxy, headless, quit } = params;

  return scenario.code({ phone, browser, proxy, headless, quit });
});

scenarioGeneratorFactories.set(Scenario.AddToCart, (params: any) => {
  const scenario: AddToCartScenario = container.get("add-to-cart-scenario");
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
  const scenario: KeyPhraseScenario = container.get("key-phrase-scenario");
  const { phone, keyPhrase, browser, proxy, headless, quit } = params;

  return scenario.keyPhrase({ phone, keyPhrase, browser, proxy, headless, quit });
});

scenarioGeneratorFactories.set(Scenario.Login, (params: any) => {
  const scenario: LoginScenario = container.get("login-scenario");

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
