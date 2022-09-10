import { Command, Option } from "commander";
import { container } from "../app/service-container";
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
  .addOption(
    new Option("--browser <string>", "browser name").choices(["chrome", "firefox"]).default("chrome")
  )
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, browser, proxy, headless, quit }) => {
    const profileUsecase: ProfileUsecase = container.get("profile-usecase");

    const profileGenerator: AsyncGenerator<StepMessage> = profileUsecase.profile({
      phone,
      browser,
      proxy,
      headless,
      quit
    });

    try {
      for await (const msg of profileGenerator) {
        console.log(msg);
      }
    } catch (e) {
      if (e instanceof ProfileUsecaseError) {
        console.log(e);

        return;
      }

      console.log("internal error: ", e);
    }
  });
