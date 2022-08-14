const {smsActivateClient} = require("../service/sms-activate-client");
const {SECOND} = require("../../libs/time");

async function pollSmsCode(rentId, findNewSmsCode) {
  let interval;
  let timeout;

  try {
    return await Promise.race([
      new Promise(resolve => {
        interval = setInterval(async () => {
          let data;

          try {
            data = await smsActivateClient.getRentStatus({id: rentId});
          } catch (e) {
            console.log(e.message);

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

async function getRentIdByPhone(phone) {
  const data = await smsActivateClient.getRentList();

  if (!data.values) {
    throw new Error('no "values" field.');
  }

  const values = Object.values(data.values);

  if (values.length === 0) {
    throw new Error("empty values.");
  }

  for (const value of values) {
    if (value.phone === phone) {
      return value.id;
    }
  }

  throw new Error(`record not found for phone "${phone}"`);
}

module.exports = {
  pollSmsCode,
  getRentIdByPhone
};
