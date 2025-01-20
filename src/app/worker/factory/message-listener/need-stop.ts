import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { NeedStopMessageListener } from "../../impl/message-listener/need-stop";

export class NeedStopMessageListenerFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new NeedStopMessageListener();
  }
}
