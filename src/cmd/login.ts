import { Command, Option } from "commander";
import type { StepMessage } from "../app/usecase/step-message";
import {
  DebuggerAddressNotificationStepMessageType,
  NeedStopProcessStepMessageType
} from "../app/usecase/step-message";
import { fork } from "child_process";
import path from "path";
import fs from "fs";
import { createLogDirPath } from "../utils/utils";

export const loginCmd = new Command();

loginCmd
  .name("login")
  .description("login user, if phone is empty, new user will be created")
  .addOption(new Option("--phone <string>", "user's phone number, ex. 79231234567"))
  .addOption(new Option("--gender <string>", "user's gender").choices(["man", "woman"]))
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--no-proxy", "do not use proxy"))
  .addOption(
    new Option("--user-agent <string>", "a string that contains a specific user agent")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, gender, browser, proxy, userAgent, headless, quit }) => {
    console.log("process pid: ", process.pid);

    const child = fork(path.resolve(__dirname, "../app/worker/login"), { silent: true });

    const logStdoutStream = fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-login-stdout.log`), { flags: "a" });
    const logStderrStream = fs.createWriteStream(path.resolve(createLogDirPath(), `${process.pid}-${child.pid}-login-stderr.log`), { flags: "a" });

    child.stdout!.pipe(logStdoutStream);
    child.stderr!.pipe(logStderrStream);

    child.send({ phone, gender, browser, proxy, userAgent, headless, quit });
    child.on("message", (msg: StepMessage) => {
      if (msg.type === NeedStopProcessStepMessageType) {
        process.kill(child.pid!, "SIGSTOP");
      }

      if (msg.type === DebuggerAddressNotificationStepMessageType) {
        const screencast = fork(path.resolve(__dirname, "../app/worker/screencast"), { silent: true });
        screencast.send({ debuggerAddress: msg.data.debuggerAddress });
      }
    });
  });
