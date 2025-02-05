import { Command, Option } from "commander";
import { container } from "../app/service-container";
import type { WbUserRepository } from "../app/repository/wb-user";
import { Scenario } from "../app/scenario/scenario";
import type { WorkersLauncher } from "../app/worker/workers-launcher";
import fs from "fs";
import { createOrdersFilePath } from "../utils/utils";

export const orderCmd = new Command();

orderCmd
  .name("order")
  .description("get orders")
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

    await fs.promises.writeFile(createOrdersFilePath(), [
      "phone",
      "vendorCode",
      "name",
      "price",
      "size",
      "orderDate",
      "receiveDate",
      "status"
    ].join(",") + "\n");

    const workersLauncher: WorkersLauncher = container.get("workers-launcher");
    await workersLauncher.launch({
      scenario: Scenario.Order,
      paramsIterator: paramsList[Symbol.iterator](),
      workersCount,
      retriesCount: workerRetries,
      getParamsKey: (jobIndex: number, params: any) => params.phone,
      messageListeners: [
        container.get("debugger-address-message-listener"),
        container.get("need-stop-message-listener"),
        container.get("order-item-message-listener")
      ]
    });
  });
