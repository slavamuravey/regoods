import { CodeReceiverFactory } from "./service/factory/code-receiver";
import { SmsActivateClientFactory } from "./service/factory/sms-activate-client";
import { RandomDataToolsClientFactory } from "./service/factory/random-data-tools-client";
import { PhoneRenterFactory } from "./service/factory/phone-renter";
import { RandomNameGeneratorFactory } from "./service/factory/random-name-generator";
import { WbUserRepositoryFactory } from "./repository/factory/wb-user";
import { LoginUsecaseFactory } from "./usecase/factory/login";
import { ProfileUsecaseFactory } from "./usecase/factory/profile";
import { Container } from "../libs/service-container";
import type { ServiceSpec } from "../libs/service-container/types";

const spec: ServiceSpec = new Map();

spec.set("code-receiver", {
  factory: new CodeReceiverFactory()
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
spec.set("phone-renter", {
  factory: new PhoneRenterFactory()
});
spec.set("random-name-generator", {
  factory: new RandomNameGeneratorFactory()
});
spec.set("login-usecase", {
  factory: new LoginUsecaseFactory()
});
spec.set("profile-usecase", {
  factory: new ProfileUsecaseFactory()
});

export const container = new Container(spec);
