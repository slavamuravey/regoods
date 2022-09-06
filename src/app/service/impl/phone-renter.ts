import type { PhoneRenter, RentResult } from "../phone-renter";
import type { Client } from "../../../libs/sms-activate/types";
import { storeSmsActiveRentId } from "../../utils/utils";

export class PhoneRenterImpl implements PhoneRenter {
  constructor(readonly smsActivateClient: Client) {
    this.smsActivateClient = smsActivateClient;
  }

  async rent(): Promise<RentResult> {
    const { phone: { number, id } } = await this.smsActivateClient.getRentNumber({ service: "uu" });

    await storeSmsActiveRentId(number, String(id));

    return {
      phone: number
    }
  }
}
