import { CodeReceiverImpl } from "../impl/code-receiver";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class CodeReceiverFactory implements ServiceFactory {
  create(container: ServiceContainer): CodeReceiverImpl {
    return new CodeReceiverImpl(container.get("sms-activate-client"));
  }
}
