import path from "path";
import fs from "fs";
import { fork } from "child_process";
import { container } from "../service-container";
import type { LoginParams, LoginUsecase } from "../usecase/login";
import type { StepMessage } from "../usecase/step-message";
import { LoginUsecaseError } from "../usecase/login";
import { createLogDirPath } from "../../utils/utils";
import { DebuggerAddressNotificationStepMessageType, NeedStopProcessStepMessageType } from "../usecase/step-message";

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

    console.error("internal error: ", e);
  } finally {
    process.exit();
  }
});

export interface LoginRunPayload extends LoginParams {
}

export function run({ phone, gender, browser, proxy, userAgent, headless, quit }: LoginRunPayload) {
  const child = fork(__filename, { silent: true });

  const createLogStdoutStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-login-stdout.log`), { flags: "a" });
  const createLogStderrStream = () => fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-login-stderr.log`), { flags: "a" });

  child.stdout!.pipe(createLogStdoutStream());
  child.stderr!.pipe(createLogStderrStream());

  child.send({ phone, gender, browser, proxy, userAgent, headless, quit });
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
