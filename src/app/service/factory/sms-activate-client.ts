import { Client as SmsActivateClient } from "../../../libs/sms-activate";
import { environment } from "../../environment/environment";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class SmsActivateClientFactory implements ServiceFactory {
  create(container: ServiceContainer): SmsActivateClient {
    return new SmsActivateClient(environment.api.smsActivate.axios);
  }
}
