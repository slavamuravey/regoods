import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { LoginParams, LoginUsecase } from "../usecase/login";
import type { StepMessage } from "../usecase/step-message";
import { LoginUsecaseError } from "../usecase/login";
import { createLogDirPath } from "../../utils/utils";
import { DebuggerAddressNotificationStepMessageType, NeedStopProcessStepMessageType } from "../usecase/step-message";
import type { WorkerRunResult } from "./worker";

process.on("message", async ({ phone, gender, browser, proxy, userAgent, headless, quit }) => {
  const loginUsecase: LoginUsecase = container.get("login-usecase");

  const params: LoginParams = {
    browser,
    proxy,
    userAgent,
    headless,
    quit
  };

  if (phone) {
    params.phone = phone;
  }

  if (gender) {
    params.gender = gender;
  }

  const loginGenerator: AsyncGenerator<StepMessage> = loginUsecase.login(params);

  let exitCode = 0;

  try {
    for await (const msg of loginGenerator) {
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof LoginUsecaseError) {
      console.error(e);

      return;
    }

    exitCode = 1;
    console.error("internal error: ", e);
  } finally {
    process.exit(exitCode);
  }
});

export interface WorkerParams extends LoginParams {
}

export function run({ phone, gender, browser, proxy, userAgent, headless, quit, screencast }: WorkerParams): WorkerRunResult {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-login-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${phone}-${process.pid}-${child.pid}-login-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, gender, browser, proxy, userAgent, headless, quit });
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
