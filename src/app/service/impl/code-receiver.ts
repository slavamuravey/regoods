import fs from "fs";
import { SECOND } from "../../../libs/time";
import { DateTime } from "luxon";
import { createSmsActiveRentIdFilePath } from "../../utils/utils";
import type { Client, GetRentStatusResponse } from "../../../libs/sms-activate/types";
import type { CodeReceiver } from "../code-receiver";

export class CodeReceiverImpl implements CodeReceiver {
  constructor(readonly smsActivateClient: Client) {
    this.smsActivateClient = smsActivateClient;
  }

  async receiveCode(phone: string): Promise<string> {
    const now = DateTime.now();
    const rentId = await fs.promises.readFile(createSmsActiveRentIdFilePath(phone), { encoding: "utf8" });

    return await this.pollSmsCode(rentId, (data: GetRentStatusResponse): string | never => {
      const date = data?.values?.[0]?.date;

      if (!date) {
        throw new Error('no "date" field in response.');
      }

      const lastSmsDateTime = DateTime.fromFormat(`${date} +3`, "y-LL-dd TT Z");

      if (!lastSmsDateTime.isValid) {
        throw new Error(`invalid value "${date}" for field "date" in response, reason: ${lastSmsDateTime.invalidReason}.`);
      }

      if (lastSmsDateTime > now) {
        const code = data?.values?.[0]?.text?.match(/(\d+)/)?.[0];

        if (!code) {
          throw new Error("can't find any code in message.");
        }

        return code;
      }

      throw new Error(`last code is outdated: now is "${now}", last date is: ${lastSmsDateTime}`);
    });
  }

  private async pollSmsCode(rentId: string, findNewSmsCode: (data: GetRentStatusResponse) => string | never) {
    let interval;
    let timeout;

    try {
      return await new Promise<string>((resolve, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("login timeout exceeded."))
        }, SECOND * 60);
        interval = setInterval(async () => {
          let data;

          try {
            data = await this.smsActivateClient.getRentStatus({ id: rentId });

            if (data.status === "finish") {
              reject(`rent "${rentId}" has finished.`);

              return;
            }
          } catch (e: any) {
            if (e?.message !== "STATUS_WAIT_CODE") {
              reject(e);

              return;
            }

            console.log("wait for the first sms.");

            return;
          }

          try {
            const code = findNewSmsCode(data);

            resolve(code);
          } catch (e) {
            console.log("no new code: ", e);
          }
        }, SECOND);
      })
    } finally {
      clearTimeout(timeout);
      clearInterval(interval);
    }
  }
}
