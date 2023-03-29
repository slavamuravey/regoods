import type { Container, ServiceFactory } from "../../../../libs/service-container/types";
import { OrderItemMessageListener } from "../../impl/message-listener/order-item";

export class OrderItemMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new OrderItemMessageListener();
  }
}
