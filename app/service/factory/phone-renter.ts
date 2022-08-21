import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { PhoneRenter } from "../phone-renter";

export class PhoneRenterFactory implements ServiceFactory {
  create(container: Container): PhoneRenter {
    return new PhoneRenter(container.get("sms-activate-client"));
  }
}
