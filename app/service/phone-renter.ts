import { PhoneRenter as PhoneRenterInterface, RentResult } from "./types";
import { Client } from "../../libs/sms-activate/types";
import { createSmsActiveRentId } from "../utils/utils";

export class PhoneRenter implements PhoneRenterInterface {
  private smsActivateClient: Client;

  constructor(smsActivateClient: Client) {
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
