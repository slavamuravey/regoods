import { CodeReceiverFactory } from "./service/factory/code-receiver";
import { SeleniumWebdriverFactory } from "./service/factory/selenium-webdriver";
import { SmsActivateClientFactory } from "./service/factory/sms-activate-client";
import { WbUserRepositoryFactory } from "./service/factory/wb-user-repository";
import { RandomDataToolsClientFactory } from "./service/factory/random-data-tools-client";
import { Container } from "../libs/service-container";

const spec = new Map();

spec.set("code-receiver", {
  factory: new CodeReceiverFactory()
});
spec.set("selenium-webdriver", {
  factory: new SeleniumWebdriverFactory()
});
spec.set("sms-activate-client", {
  factory: new SmsActivateClientFactory()
});
spec.set("random-data-tools-client", {
  factory: new RandomDataToolsClientFactory()
});
spec.set("wb-user-repository", {
  factory: new WbUserRepositoryFactory()
});

export const container = new Container(spec);
