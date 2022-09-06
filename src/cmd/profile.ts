import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { ProfileUsecaseError } from "../app/usecase/profile";
import { USER_AGENT_RANDOM } from "../app/usecase/user-agent";
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
  .addOption(
    new Option("--proxy <string>", "the ipv4 of a proxy server, ex. http://193.233.75.242:59100")
  )
  .addOption(
    new Option("--user-agent <string>", "a string that contains a specific user agent").default(USER_AGENT_RANDOM)
  )
  .addOption(
    new Option("--no-user-agent <string>", "do not set any user agent")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, browser, proxy, userAgent, headless, quit }) => {
    const profileUsecase: ProfileUsecase = container.get("profile-usecase");

    const profileGenerator: AsyncGenerator<StepMessage> = profileUsecase.profile({
      wbUserId: phone,
      browser,
      proxy,
      userAgent,
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
