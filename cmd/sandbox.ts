import path from "path";
import { findEnvFile } from "../libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(path.dirname(__dirname), process.env.NODE_ENV) });

import { container } from "../app/service-container";
import type { Client } from "../libs/random-data-tools/types";

(async () => {
  try {
    const client: Client = container.get("random-data-tools-client");
    const name = await client.getRandomName({ gender: "woman" });

    console.log(name);
  } catch (e) {
    console.log(e);
  }
})();
