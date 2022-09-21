import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { CodeUsecase, CodeParams } from "../usecase/code";
import type { StepMessage } from "../usecase/step-message";
import { CodeUsecaseError } from "../usecase/code";
import { createDeliveryCodesFilePath, createLogDirPath } from "../../utils/utils";
import {
  DebuggerAddressNotificationStepMessageType,
  DeliveryItemNotification,
  NeedStopProcessStepMessageType
} from "../usecase/step-message";
import type { WorkerRunResponse } from "./worker";

process.on("message", async ({ phone, browser, proxy, headless, quit }) => {
  const codeUsecase: CodeUsecase = container.get("code-usecase");

  const codeGenerator: AsyncGenerator<StepMessage> = codeUsecase.code({ phone, browser, proxy, headless, quit });

  try {
    for await (const msg of codeGenerator) {
      console.log(msg);

      if (msg instanceof DeliveryItemNotification) {
        const { data: { phone, address, code, status, vendorCode } } = msg;
        await fs.promises.appendFile(createDeliveryCodesFilePath(), [
          `"${phone}"`,
          `"${address}"`,
          `"${code}"`,
          `"${status}"`,
          `"${vendorCode}"`
        ].join(",") + "\n");
      }

      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof CodeUsecaseError) {
      console.error(e);

      return;
    }

    console.error("internal error: ", e);
  } finally {
    process.exit();
  }
});

export interface CodeRunPayload extends CodeParams {
}

export function run({ phone, browser, proxy, headless, quit, screencast }: CodeRunPayload): WorkerRunResponse {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-code-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-code-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, browser, proxy, headless, quit });
  child.on("message", (msg: StepMessage) => {
    if (msg.type === NeedStopProcessStepMessageType) {
      process.kill(child.pid!, "SIGSTOP");
    }

    if (msg.type === DebuggerAddressNotificationStepMessageType) {
      if (screencast) {
        const screencast = fork(path.resolve(__dirname, "./screencast"), { silent: true });
        screencast.stdout!.pipe(createLogStdoutStream());
        screencast.stderr!.pipe(createLogStderrStream());
        screencast.send({ debuggerAddress: msg.data.debuggerAddress });
      }
    }
  });

  return {
    pid: child.pid!,
    result: new Promise((resolve, reject) => {
      child.on("exit", (code) => {
        code === 0 ? resolve(code) : reject(code);
      });
    })
  };
}
