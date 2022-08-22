import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { PhoneRenterImpl } from "../impl/phone-renter";

export class PhoneRenterFactory implements ServiceFactory {
  create(container: Container): PhoneRenterImpl {
    return new PhoneRenterImpl(container.get("sms-activate-client"));
  }
}
