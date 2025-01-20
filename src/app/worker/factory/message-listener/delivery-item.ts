import { DeliveryItemMessageListener } from "../../impl/message-listener/delivery-item";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class DeliveryItemMessageListenerFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new DeliveryItemMessageListener();
  }
}
