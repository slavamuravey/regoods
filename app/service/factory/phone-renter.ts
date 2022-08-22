import { PhoneRenterImpl } from "../impl/phone-renter";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class PhoneRenterFactory implements ServiceFactory {
  create(container: Container): PhoneRenterImpl {
    return new PhoneRenterImpl(container.get("sms-activate-client"));
  }
}
