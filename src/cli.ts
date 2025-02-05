import { ROOT_DIR } from "./settings";
import { findEnvFile } from "./libs/env";
import dotenv from "dotenv";

dotenv.config({ path: findEnvFile(ROOT_DIR, process.env.NODE_ENV) });

import { version, name, description } from "../package.json";
import { Command } from "commander";
import { profileCmd } from "./cmd/profile";
import { loginCmd } from "./cmd/login";
import { addToCartCmd } from "./cmd/add-to-cart";
import { codeCmd } from "./cmd/code";
import { keyPhraseCmd } from "./cmd/key-phrase";
import { orderCmd } from "./cmd/order";

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version);

program.addCommand(profileCmd);
program.addCommand(loginCmd);
program.addCommand(addToCartCmd);
program.addCommand(codeCmd);
program.addCommand(keyPhraseCmd);
program.addCommand(orderCmd);

program.parse();
