import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import { container } from "../app/service-container";

(async () => {
  try {
    await container.get("wb-user-repository").create({ id: "234", cookies: "zzz" });
  } catch (e) {
    console.log(e);
  }
})();