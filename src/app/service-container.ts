import { CodeReceiverFactory } from "./service/factory/code-receiver";
import { SmsActivateClientFactory } from "./service/factory/sms-activate-client";
import { RandomDataToolsClientFactory } from "./service/factory/random-data-tools-client";
import { PhoneRenterFactory } from "./service/factory/phone-renter";
import { RandomNameGeneratorFactory } from "./service/factory/random-name-generator";
import { WbUserSessionRepositoryFactory } from "./repository/factory/wb-user-session";
import { WbUserRepositoryFactory } from "./repository/factory/wb-user";
import { ProxyRepositoryFactory } from "./repository/factory/proxy";
import { ProxyResolverFactory } from "./service/factory/proxy-resolver";
import { LoginUsecaseFactory } from "./usecase/factory/login";
import { ProfileUsecaseFactory } from "./usecase/factory/profile";
import { CodeUsecaseFactory } from "./usecase/factory/code";
import { AddToCartUsecaseFactory } from "./usecase/factory/add-to-cart";
import { KeyPhraseUsecaseFactory } from "./usecase/factory/key-phrase";
import { ScreencastLauncherFactory } from "./worker/factory/screencast-launcher";
import { JobLauncherFactory } from "./worker/factory/job-launcher";
import { DebuggerAddressMessageListenerFactory } from "./worker/message-listener/factory/debugger-address";
import { NeedStopMessageListenerFactory } from "./worker/message-listener/factory/need-stop";
import { ScreencastFrameListenerFactory } from "./worker/factory/screencast-frame-listener";
import { WorkersLauncherFactory } from "./worker/factory/workers-launcher";
import { DeliveryItemMessageListenerFactory } from "./worker/message-listener/factory/delivery-item";
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
spec.set("wb-user-session-repository", {
  factory: new WbUserSessionRepositoryFactory()
});
spec.set("wb-user-repository", {
  factory: new WbUserRepositoryFactory()
});
spec.set("proxy-repository", {
  factory: new ProxyRepositoryFactory()
});
spec.set("phone-renter", {
  factory: new PhoneRenterFactory()
});
spec.set("random-name-generator", {
  factory: new RandomNameGeneratorFactory()
});
spec.set("proxy-resolver", {
  factory: new ProxyResolverFactory()
});
spec.set("login-usecase", {
  factory: new LoginUsecaseFactory()
});
spec.set("profile-usecase", {
  factory: new ProfileUsecaseFactory()
});
spec.set("code-usecase", {
  factory: new CodeUsecaseFactory()
});
spec.set("add-to-cart-usecase", {
  factory: new AddToCartUsecaseFactory()
});
spec.set("key-phrase-usecase", {
  factory: new KeyPhraseUsecaseFactory()
});
spec.set("screencast-launcher", {
  factory: new ScreencastLauncherFactory()
});
spec.set("job-launcher", {
  factory: new JobLauncherFactory()
});
spec.set("debugger-address-message-listener", {
  factory: new DebuggerAddressMessageListenerFactory()
});
spec.set("delivery-item-message-listener", {
  factory: new DeliveryItemMessageListenerFactory()
});
spec.set("need-stop-message-listener", {
  factory: new NeedStopMessageListenerFactory()
});
spec.set("screencast-frame-listener", {
  factory: new ScreencastFrameListenerFactory()
});
spec.set("workers-launcher", {
  factory: new WorkersLauncherFactory()
});

export const container = new Container(spec);
