import { Command, Option } from "commander";
import { fork } from "child_process";
import path from "path";
import type { StepMessage } from "../app/usecase/step-message";
import {
  DebuggerAddressNotificationStepMessageType,
  NeedStopProcessStepMessageType
} from "../app/usecase/step-message";
import fs from "fs";
import { createLogDirPath } from "../utils/utils";
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
  .addOption(new Option("--no-proxy", "do not use proxy"))
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
    console.log("process pid: ", process.pid);

    const child = fork(path.resolve(__dirname, "../app/worker/add-to-cart"), { silent: true });

    const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stdout.log`), { flags: "a" });
    const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stderr.log`), { flags: "a" });

    const logStdoutStream = createLogStdoutStream();
    const logStderrStream = createLogStderrStream();

    process.stdout.isTTY = false;
    process.stderr.isTTY = false;
    // @ts-ignore
    process.stdout.write = logStdoutStream.write.bind(logStdoutStream);
    // @ts-ignore
    process.stderr.write = logStderrStream.write.bind(logStderrStream);

    child.stdout!.pipe(logStdoutStream);
    child.stderr!.pipe(logStderrStream);

    child.send({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit });
    child.on("message", ({ msg, err }: { msg: StepMessage | null, err: Error | null }) => {
      if (err !== null) {
        if (err.name === AddToCartUsecaseError.name) {
          console.error(err);
        } else {
          console.error("internal error: ", err);
        }

        return;
      }

      console.log(msg);

      if (msg?.type === NeedStopProcessStepMessageType) {
        process.kill(child.pid!, "SIGSTOP");
      }

      if (msg?.type === DebuggerAddressNotificationStepMessageType) {
        const screencast = fork(path.resolve(__dirname, "../app/worker/screencast"), { silent: true });
        const logStdoutStream = createLogStdoutStream();
        const logStderrStream = createLogStderrStream();
        screencast.stdout!.pipe(logStdoutStream);
        screencast.stderr!.pipe(logStderrStream);
        screencast.send({ debuggerAddress: msg.data.debuggerAddress });
        screencast.on("message", ({ msg, err }: { msg: string | null, err: Error | null }) => {
          if (err !== null) {
            console.error("screencast error: ", err);

            return;
          }

          console.log("screencast message: ", msg);
        });
      }
    });
  });
