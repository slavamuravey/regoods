import type { Container, ServiceFactory } from "../../../../libs/service-container/types";
import { DebuggerAddressMessageListener } from "../debugger-address";

export class DebuggerAddressMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new DebuggerAddressMessageListener(container.get("screencast-launcher"), (params) => !!params.screencast);
  }
}
