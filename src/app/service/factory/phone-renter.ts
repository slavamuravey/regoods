import { PhoneRenterImpl } from "../impl/phone-renter";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class PhoneRenterFactory implements ServiceFactory {
  create(container: ServiceContainer): PhoneRenterImpl {
    return new PhoneRenterImpl(container.get("sms-activate-client"));
  }
}
