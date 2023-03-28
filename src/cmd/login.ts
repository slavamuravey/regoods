import { Command, Option } from "commander";
import type { WorkersLauncher } from "../app/worker/workers-launcher";
import { container } from "../app/service-container";
import { Scenario } from "../app/scenario/scenario";

export const loginCmd = new Command();

loginCmd
  .name("login")
  .description("login user, if phone is empty, new user will be created")
  .addOption(new Option("--phone <string>", "user's phone number, ex. 79231234567"))
  .addOption(new Option("--gender <string>", "user's gender").choices(["man", "woman"]))
  .addOption(new Option("--workers-count <string>", "workers count, ignored when --phone is not empty").default(1))
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
  .addOption(new Option("--screencast", "enable screencast"))
  .action(async ({ phone, gender, workersCount, browser, proxy, userAgent, headless, quit, screencast, workerRetries = 0 }) => {
    console.log("process pid: ", process.pid);

    const paramsList = [{ phone, gender, browser, proxy, userAgent, headless, quit, screencast }];

    const workersLauncher: WorkersLauncher = container.get("workers-launcher");
    await workersLauncher.launch({
      scenario: Scenario.Login,
      paramsIterator: paramsList[Symbol.iterator](),
      workersCount,
      retriesCount: workerRetries,
      getParamsKey: (jobIndex: number, params: any) => params.phone,
      messageListeners: [
        container.get("debugger-address-message-listener"),
        container.get("need-stop-message-listener")
      ]
    });
  });
