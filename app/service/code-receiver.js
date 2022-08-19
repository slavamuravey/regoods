const {SECOND} = require("../../libs/time");
const {DateTime} = require("luxon");
const fs = require("fs");
const {createRentIdFilePath} = require("../utils/utils");

class CodeReceiver {
  smsActivateClient;

  constructor(smsActivateClient) {
    this.smsActivateClient = smsActivateClient;
  }

  async receiveCode(phone) {
    const now = DateTime.now();
    const rentId = await fs.promises.readFile(createRentIdFilePath(phone), { encoding: "utf8" });

    return await this.pollSmsCode(rentId, data => {
      const date = data?.values?.[0]?.date;

      if (!date) {
        throw new Error('no "date" field in response.');
      }

      const lastSmsDateTime = DateTime.fromFormat(`${date} +3`, "y-LL-dd TT Z");

      if (!lastSmsDateTime.isValid) {
        throw new Error(`invalid value "${date}" for field "date" in response, reason: ${lastSmsDateTime.invalidReason}.`);
      }

      if (lastSmsDateTime > now) {
        return data?.values?.[0]?.text?.match(/(\d+)/)[0];
      }

      throw new Error(`last code is outdated: now is "${now}", last date is: ${lastSmsDateTime}`);
    });
  }

  async pollSmsCode(rentId, findNewSmsCode) {
    let interval;
    let timeout;

    try {
      return await Promise.race([
        new Promise((resolve, reject) => {
          interval = setInterval(async () => {
            let data;

            try {
              data = await this.smsActivateClient.getRentStatus({id: rentId});
            } catch (e) {
              if (e.message !== "STATUS_WAIT_CODE") {
                reject(e.message);

                return;
              }

              console.log("wait for the first sms.");

              return;
            }

            try {
              const code = findNewSmsCode(data);

              resolve(code);
            } catch (e) {
              console.log("no new code: ", e.message);
            }
          }, SECOND);
        }),
        new Promise((resolve, reject) => {
          timeout = setTimeout(() => {
            reject(new Error("login timeout exceeded."))
          }, SECOND * 60);
        }),
      ]);
    } catch(e) {
      throw e;
    } finally {
      clearTimeout(timeout);
      clearInterval(interval);
    }
  }
}

module.exports = {
  CodeReceiver
};
