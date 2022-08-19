const path = require("path");
const {findEnvFile} = require("./../libs/env");
const dotenv = require("dotenv");
dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

const {container} = require("../app/service-container");

(async () => {
  try {
    await container.get("wb-user-repository").create({id: "234", cookies: "zzz"});
  } catch (e) {
    console.log(e);
  }
})();