import { DeliveryItemMessageListener } from "../../impl/message-listener/delivery-item";
import type { Container, ServiceFactory } from "../../../../libs/service-container/types";

export class DeliveryItemMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new DeliveryItemMessageListener();
  }
}
