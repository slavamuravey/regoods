import { Command, Option } from "commander";
import { fork } from "child_process";
import path from "path";
import { NeedStopProcessStepMessageType, StepMessage } from "../app/usecase/step-message";
import { AddToCartUsecaseError } from "../app/usecase/add-to-cart";

export const addToCartCmd = new Command();

addToCartCmd
  .name("add-to-cart")
  .description("put the item in the cart")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--vendor-code <string>", "the vendor code of the product").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--key-phrase <string>", "the key phrase to find the product").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--size <string>", "the size of product").makeOptionMandatory(true)
  )
  .addOption(new Option("--no-size", "do not choose size"))
  .addOption(
    new Option("--address <string>", "the address of the the issue point").makeOptionMandatory(true)
  )
  .addOption(new Option("--no-address", "do not choose address"))
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
    const child = fork(path.resolve(__dirname, "../app/worker/add-to-cart"));
    child.send({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit });
    child.on("message", (data: { msg: StepMessage | null, err: Error | null }) => {
      const { msg, err } = data;

      if (err) {
        if (err instanceof AddToCartUsecaseError) {
          console.error(err);

          return;
        }

        console.error("internal error: ", err);
      }

      console.log(msg);

      if (msg!.type === NeedStopProcessStepMessageType) {
        process.kill(child.pid!, "SIGSTOP");
      }
    });
  });
