import { Command, Option } from "commander";
import { fork } from "child_process";
import path from "path";
import {
  DebuggerAddressNotificationStepMessageType,
  NeedStopProcessStepMessageType,
  StepMessage
} from "../app/usecase/step-message";
import fs from "fs";
import { createLogDirPath } from "../utils/utils";

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
  .addOption(new Option("--no-proxy", "do not use proxy"))
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
    console.log("process pid: ", process.pid);

    const child = fork(path.resolve(__dirname, "../app/worker/add-to-cart"), { silent: true });

    const logStdoutStream = fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stdout.log`), { flags: "a" });
    const logStderrStream = fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stderr.log`), { flags: "a" });

    child.stdout!.pipe(logStdoutStream);
    child.stderr!.pipe(logStderrStream);

    child.send({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit });
    child.on("message", (msg: StepMessage) => {
      if (msg.type === NeedStopProcessStepMessageType) {
        process.kill(child.pid!, "SIGSTOP");
      }

      if (msg.type === DebuggerAddressNotificationStepMessageType) {
        const screencast = fork(path.resolve(__dirname, "../app/worker/screencast"), { silent: true });
        screencast.stdout!.pipe(logStdoutStream);
        screencast.stderr!.pipe(logStderrStream);
        screencast.send({ debuggerAddress: msg.data.debuggerAddress });
      }
    });
  });
