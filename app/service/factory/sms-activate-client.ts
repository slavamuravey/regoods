import { Client as SmsActivateClient } from "../../../libs/sms-activate";
import { environment } from "../../environment/environment";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class SmsActivateClientFactory implements ServiceFactory {
  create(container: Container): SmsActivateClient {
    return new SmsActivateClient(environment.api.smsActivate.axios);
  }
}
