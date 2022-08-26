import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { ProfileUsecase } from "../app/usecase/profile";
import { ProfileUsecaseError } from "../app/usecase/profile";
import type { StepMessage } from "../app/usecase/step-message";

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

      const profileGenerator: AsyncGenerator<StepMessage> = profileUsecase.profile({ wbUserId: phone });

      try {
        for await (const msg of profileGenerator) {
          console.log({
            ...msg,
            screenshot: msg.screenshot?.slice(-10)
          });
        }
      } catch (e) {
        if (e instanceof ProfileUsecaseError) {
          console.log(e);

          return;
        }

        console.log("internal error: ", e);
      } finally {
        driver.quit();
      }
    })();
  });
