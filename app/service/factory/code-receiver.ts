import {CodeReceiver} from "../code-receiver";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class CodeReceiverFactory implements ServiceFactory {
  create(container: Container): CodeReceiver {
    return new CodeReceiver(container.get("sms-activate-client"));
  }
}
