import type { PhoneRenter, RentResult } from "../phone-renter";
import type { Client } from "../../../libs/sms-activate/types";
import { createSmsActiveRentId } from "../../utils/utils";

export class PhoneRenterImpl implements PhoneRenter {
  constructor(readonly smsActivateClient: Client) {
    this.smsActivateClient = smsActivateClient;
  }

  async rent(): Promise<RentResult> {
    const { phone: { number, id } } = await this.smsActivateClient.getRentNumber({ service: "uu" });

    await createSmsActiveRentId(number, String(id));

    return {
      phone: number
    }
  }
}
