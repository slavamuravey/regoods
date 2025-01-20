import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { OrderItemMessageListener } from "../../impl/message-listener/order-item";

export class OrderItemMessageListenerFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new OrderItemMessageListener();
  }
}
