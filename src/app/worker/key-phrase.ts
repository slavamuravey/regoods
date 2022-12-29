import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { KeyPhraseParams, KeyPhraseUsecase } from "../usecase/key-phrase";
import type { StepMessage } from "../usecase/step-message";
import { DebuggerAddressNotificationStepMessageType, NeedStopProcessStepMessageType } from "../usecase/step-message";
import { createLogDirPath } from "../../utils/utils";
import { ExitCodeInternalError, ExitCodeSuccess, ExitCodeUsecaseError } from "./exit-code";
import type { WorkerRunResult } from "./worker";
import { UsecaseError } from "../usecase/error";

process.on("message", async ({ phone, keyPhrase, browser, proxy, headless, quit }) => {
  const keyPhraseUsecase: KeyPhraseUsecase = container.get("key-phrase-usecase");

  const keyPhraseGenerator: AsyncGenerator<StepMessage> = keyPhraseUsecase.keyPhrase({ phone, keyPhrase, browser, proxy, headless, quit });

  let exitCode = ExitCodeSuccess;

  try {
    for await (const msg of keyPhraseGenerator) {
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

export interface WorkerParams extends KeyPhraseParams {
}

export function run({ phone, keyPhrase, browser, proxy, headless, quit, screencast }: WorkerParams): WorkerRunResult {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-key-phrase-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-key-phrase-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, keyPhrase, browser, proxy, headless, quit });
  child.on("message", async (msg: StepMessage) => {
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
