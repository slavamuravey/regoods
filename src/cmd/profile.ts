import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { ProfileUsecase } from "../app/usecase/profile";

export const profileCmd = new Command();

profileCmd
  .name("profile")
  .description("move to user's profile")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567").makeOptionMandatory(true)
  )
  .action(({ phone }) => {
    (async () => {
      const driver: ThenableWebDriver = container.get("selenium-webdriver");
      const profileUsecase: ProfileUsecase = container.get("profile-usecase");

      try {
        await profileUsecase.profile({ wbUserId: phone });
        driver.quit();
      } catch (e) {
        console.log(e);
        driver.quit();
      }
    })();
  });
