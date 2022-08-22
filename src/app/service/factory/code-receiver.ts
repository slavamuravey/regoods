import { CodeReceiverImpl } from "../impl/code-receiver";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class CodeReceiverFactory implements ServiceFactory {
  create(container: Container): CodeReceiverImpl {
    return new CodeReceiverImpl(container.get("sms-activate-client"));
  }
}
