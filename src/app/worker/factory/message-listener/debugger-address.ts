import type { Container, ServiceFactory } from "../../../../libs/service-container/types";
import { DebuggerAddressMessageListener } from "../../impl/message-listener/debugger-address";
import type { ScreencastParams } from "../../params";

export class DebuggerAddressMessageListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new DebuggerAddressMessageListener(container.get("screencast-launcher"), (params: ScreencastParams) => !!params.screencast);
  }
}
