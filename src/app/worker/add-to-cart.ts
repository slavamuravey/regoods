import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { AddToCartUsecase, AddToCartParams } from "../usecase/add-to-cart";
import type { StepMessage } from "../usecase/step-message";
import { AddToCartUsecaseError } from "../usecase/add-to-cart";
import { createLogDirPath } from "../../utils/utils";
import { DebuggerAddressNotificationStepMessageType, NeedStopProcessStepMessageType } from "../usecase/step-message";

process.on("message", async ({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit }) => {
  const addToCartUsecase: AddToCartUsecase = container.get("add-to-cart-usecase");

  const addToCartGenerator: AsyncGenerator<StepMessage> = addToCartUsecase.addToCart({
    phone,
    vendorCode,
    keyPhrase,
    size,
    address,
    browser,
    proxy,
    headless,
    quit
  });

  try {
    for await (const msg of addToCartGenerator) {
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof AddToCartUsecaseError) {
      console.error(e);

      return;
    }

    console.error("internal error: ", e);
  } finally {
    process.exit();
  }
});

export interface AddToCartRunPayload extends AddToCartParams {
}

export function run({
                      phone,
                      vendorCode,
                      keyPhrase,
                      size,
                      address,
                      browser,
                      proxy,
                      headless,
                      quit
                    }: AddToCartRunPayload) {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-add-to-cart-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit });
  child.on("message", (msg: StepMessage) => {
    if (msg.type === NeedStopProcessStepMessageType) {
      process.kill(child.pid!, "SIGSTOP");
    }

    if (msg.type === DebuggerAddressNotificationStepMessageType) {
      const screencast = fork(path.resolve(__dirname, "./screencast"), { silent: true });
      screencast.stdout!.pipe(createLogStdoutStream());
      screencast.stderr!.pipe(createLogStderrStream());
      screencast.send({ debuggerAddress: msg.data.debuggerAddress });
    }
  });
}
