import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { DebuggerAddressMessageListener } from "../../impl/message-listener/debugger-address";
import type { ScreencastParams } from "../../params";

export class DebuggerAddressMessageListenerFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new DebuggerAddressMessageListener(container.get("screencast-launcher"), (params: ScreencastParams) => !!params.screencast);
  }
}
