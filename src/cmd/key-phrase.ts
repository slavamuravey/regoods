import { Command, Option } from "commander";
import { container } from "../app/service-container";
import type { WbUserRepository } from "../app/repository/wb-user";
import type { WorkersLauncher } from "../app/worker/workers-launcher";
import { Scenario } from "../app/scenario/scenario";

export const keyPhraseCmd = new Command();

keyPhraseCmd
  .name("key-phrase")
  .description("search products by key phrase")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567")
  )
  .addOption(
    new Option("--key-phrase <string>", "the key phrase to find the product").makeOptionMandatory(true)
  )
  .addOption(new Option("--requests-count <string>", "requests count means how many times to search the key phrase").makeOptionMandatory(true))
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
  .action(async ({ phone, keyPhrase, requestsCount, workersCount, browser, proxy, headless, quit, screencast, workerRetries = 2 }) => {
    console.log("process pid: ", process.pid);

    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");
    const phones = phone ? [phone] : (await wbUserRepository.findAll()).map(wbUser => wbUser.phone);
    const paramsList = phones.map(phone => ({ phone, keyPhrase, browser, proxy, headless, quit, screencast }));

    const paramsGenerator = function* () {
      let counter = 0;

      for (let i = 0; i < paramsList.length; i === paramsList.length - 1 ? i = 0 : i++) {
        if (counter >= requestsCount) {
          break;
        }

        yield paramsList[i];

        counter++;
      }
    }();

    const workersLauncher: WorkersLauncher = container.get("workers-launcher");
    await workersLauncher.launch({
      scenario: Scenario.KeyPhrase,
      paramsIterator: paramsGenerator,
      workersCount,
      retriesCount: workerRetries,
      getParamsKey: (jobIndex: number, params: any) => params.phone,
      messageListeners: [
        container.get("debugger-address-message-listener"),
        container.get("need-stop-message-listener")
      ]
    });
  });
