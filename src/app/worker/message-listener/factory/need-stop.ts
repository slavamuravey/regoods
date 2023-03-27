import { DeliveryItemMessageListener } from "../delivery-item";
import type { Container, ServiceFactory } from "../../../../libs/service-container/types";
import { NeedStopMessageListener } from "../need-stop";

export class NeedStopMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new NeedStopMessageListener();
  }
}
