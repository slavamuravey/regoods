import { CodeReceiverFactory } from "./service/factory/code-receiver";
import { SmsActivateClientFactory } from "./service/factory/sms-activate-client";
import { RandomDataToolsClientFactory } from "./service/factory/random-data-tools-client";
import { PhoneRenterFactory } from "./service/factory/phone-renter";
import { RandomNameGeneratorFactory } from "./service/factory/random-name-generator";
import { WbUserSessionRepositoryFactory } from "./repository/factory/wb-user-session";
import { WbUserRepositoryFactory } from "./repository/factory/wb-user";
import { ProxyRepositoryFactory } from "./repository/factory/proxy";
import { ProxyResolverFactory } from "./service/factory/proxy-resolver";
import { LoginScenarioFactory } from "./scenario/factory/login";
import { ProfileScenarioFactory } from "./scenario/factory/profile";
import { CodeScenarioFactory } from "./scenario/factory/code";
import { AddToCartScenarioFactory } from "./scenario/factory/add-to-cart";
import { KeyPhraseScenarioFactory } from "./scenario/factory/key-phrase";
import { OrderScenarioFactory } from "./scenario/factory/order";
import { ScreencastLauncherFactory } from "./worker/factory/screencast-launcher";
import { JobLauncherFactory } from "./worker/factory/job-launcher";
import { DebuggerAddressMessageListenerFactory } from "./worker/factory/message-listener/debugger-address";
import { NeedStopMessageListenerFactory } from "./worker/factory/message-listener/need-stop";
import { ScreencastFrameListenerFactory } from "./worker/factory/screencast-frame-listener";
import { WorkersLauncherFactory } from "./worker/factory/workers-launcher";
import { DeliveryItemMessageListenerFactory } from "./worker/factory/message-listener/delivery-item";
import { OrderItemMessageListenerFactory } from "./worker/factory/message-listener/order-item";
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
spec.set("login-scenario", {
  factory: new LoginScenarioFactory()
});
spec.set("profile-scenario", {
  factory: new ProfileScenarioFactory()
});
spec.set("code-scenario", {
  factory: new CodeScenarioFactory()
});
spec.set("add-to-cart-scenario", {
  factory: new AddToCartScenarioFactory()
});
spec.set("key-phrase-scenario", {
  factory: new KeyPhraseScenarioFactory()
});
spec.set("order-scenario", {
  factory: new OrderScenarioFactory()
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
spec.set("order-item-message-listener", {
  factory: new OrderItemMessageListenerFactory()
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
