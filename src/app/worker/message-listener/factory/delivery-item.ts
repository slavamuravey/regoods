import { DeliveryItemMessageListener } from "../delivery-item";
import type { Container, ServiceFactory } from "../../../../libs/service-container/types";

export class DeliveryItemMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new DeliveryItemMessageListener();
  }
}
