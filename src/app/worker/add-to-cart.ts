import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { AddToCartUsecase, AddToCartParams } from "../usecase/add-to-cart";
import type { StepMessage } from "../usecase/step-message";
import { createLogDirPath } from "../../utils/utils";
import { DebuggerAddressNotificationStepMessageType, NeedStopProcessStepMessageType } from "../usecase/step-message";
import { ExitCodeInternalError, ExitCodeSuccess, ExitCodeUsecaseError } from "./exit-code";
import { UsecaseError } from "../usecase/error";
import type { WorkerRunResult } from "./worker";

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

  let exitCode = ExitCodeSuccess;

  try {
    for await (const msg of addToCartGenerator) {
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof UsecaseError) {
      exitCode = ExitCodeUsecaseError;
      console.error(e);

      return;
    }

    exitCode = ExitCodeInternalError;
    console.error("internal error: ", e);
  } finally {
    process.exit(exitCode);
  }
});

export interface WorkerParams extends AddToCartParams {
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
                      quit,
                      screencast
                    }: WorkerParams): WorkerRunResult {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-add-to-cart-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-add-to-cart-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, vendorCode, keyPhrase, size, address, browser, proxy, headless, quit });
  child.on("message", (msg: StepMessage) => {
    if (msg.type === NeedStopProcessStepMessageType) {
      process.kill(child.pid!, "SIGSTOP");
    }

    if (msg.type === DebuggerAddressNotificationStepMessageType) {
      if (screencast) {
        const screencast = fork(path.resolve(__dirname, "./screencast"), { silent: true });
        screencast.stdout!.pipe(createLogStdoutStream());
        screencast.stderr!.pipe(createLogStderrStream());
        screencast.send({ phone, debuggerAddress: msg.data.debuggerAddress });
      }
    }
  });

  return {
    pid: child.pid!,
    result: new Promise((resolve) => {
      child.on("exit", (code) => {
        resolve(Number(code));
      });
    })
  };
}
