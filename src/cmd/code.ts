import { Command, Option } from "commander";
import { run } from "../app/worker/code";
import { container } from "../app/service-container";
import { WbUserRepository } from "../app/repository/wb-user";
import fs from "fs";
import { createDeliveryCodesErrorsFilePath, createDeliveryCodesFilePath } from "../utils/utils";
import { runWorkers } from "../app/worker/worker";

export const codeCmd = new Command();

codeCmd
  .name("code")
  .description("get delivery codes")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567")
  )
  .addOption(new Option("--workers-count <string>", "workers count, ignored when --phone is not empty").default(1))
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--no-proxy", "do not use proxy"))
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .addOption(new Option("--screencast", "enable screencast"))
  .action(async ({ phone, workersCount, browser, proxy, headless, quit, screencast, workerRetries = 2 }) => {
    console.log("process pid: ", process.pid);

    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");
    const phones = phone ? [phone] : (await wbUserRepository.findAll()).map(wbUser => wbUser.phone);
    const paramsList = phones.map(phone => ({ phone, browser, proxy, headless, quit, screencast }));

    await fs.promises.writeFile(createDeliveryCodesFilePath(), [
      "phone",
      "profileName",
      "address",
      "code",
      "status",
      "vendorCode"
    ].join(",") + "\n");

    await runWorkers(
      paramsList[Symbol.iterator](),
      run,
      workersCount,
      workerRetries,
      createDeliveryCodesErrorsFilePath()
    );
  });
