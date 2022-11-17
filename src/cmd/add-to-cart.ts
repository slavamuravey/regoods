import { Command, Option } from "commander";
import { createAddToCartErrorsFilePath, createRedemptionFilePath } from "../utils/utils";
import { parseCsvFile } from "../libs/csv";
import { addToCartFileFieldsConfig } from "./config";
import type { AddToCartParams } from "../app/usecase/add-to-cart";
import { runWorkers } from "../app/worker/worker";
import { run } from "../app/worker/add-to-cart";

export const addToCartCmd = new Command();

addToCartCmd
  .name("add-to-cart")
  .description("put the item in the cart")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567")
  )
  .addOption(
    new Option("--vendor-code <string>", "the vendor code of the product")
  )
  .addOption(
    new Option("--key-phrase <string>", "the key phrase to find the product")
  )
  .addOption(
    new Option("--size <string>", "the size of product")
  )
  .addOption(new Option("--no-size", "do not choose size"))
  .addOption(
    new Option("--address <string>", "the address of the the issue point")
  )
  .addOption(new Option("--no-address", "do not choose address"))
  .addOption(new Option("--workers-count <string>", "workers count, ignored when --phone is not empty").default(1))
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--no-proxy", "do not use proxy"))
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .addOption(new Option("--screencast", "enable screencast"))
  .action(async ({ phone, vendorCode, keyPhrase, size, address, workersCount, browser, proxy, headless, quit, screencast, workerRetries = 2 }) => {
    console.log("process pid: ", process.pid);

    if (phone) {
      for (const [paramName, paramValue] of Object.entries({vendorCode, keyPhrase})) {
        if (!paramValue) {
          console.error(`${paramName}: required option is not specified.`);
          process.exit(1);
        }
      }
    }

    const paramsList = phone ?
      [{phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit, screencast}] :
      await parseCsvFile<any, AddToCartParams>(createRedemptionFilePath(), addToCartFileFieldsConfig)
    ;

    await runWorkers(
      paramsList[Symbol.iterator](),
      run,
      workersCount,
      workerRetries,
      createAddToCartErrorsFilePath()
    );
  });
