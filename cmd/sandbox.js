const path = require("path");
const {findEnvFile} = require("./../libs/env");
const dotenv = require("dotenv");
dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

const {smsActivateClient} = require("../app/service/sms-activate-client");
const {getRentIdByPhone} = require("../app/usecase/utils");

(async () => {
  try {
    // const data = await smsActivateClient.getRentList();
    // console.log(data);
    const rentId = await getRentIdByPhone("79303183553");
    console.log(rentId);

  } catch (e) {
    console.log(e);
  } finally {
  }
})();