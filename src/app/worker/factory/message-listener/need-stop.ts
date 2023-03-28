import type { Container, ServiceFactory } from "../../../../libs/service-container/types";
import { NeedStopMessageListener } from "../../impl/message-listener/need-stop";

export class NeedStopMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new NeedStopMessageListener();
  }
}
