import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { ProfileUsecaseError } from "../app/usecase/profile";
import type { ProfileUsecase } from "../app/usecase/profile";
import type { StepMessage } from "../app/usecase/step-message";

export const profileCmd = new Command();

profileCmd
  .name("profile")
  .description("move to user's profile")
  .addOption(
    new Option("--phone <string>", "user's phone number, ex. 79231234567").makeOptionMandatory(true)
  )
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, browser, headless, quit }) => {
    const profileUsecase: ProfileUsecase = container.get("profile-usecase");

    const profileGenerator: AsyncGenerator<StepMessage> = profileUsecase.profile({
      wbUserId: phone,
      browser,
      headless,
      quit
    });

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
    }
  });
