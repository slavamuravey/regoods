import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { LoginUsecaseError } from "../app/usecase/login";
import type { LoginParams, LoginUsecase } from "../app/usecase/login";
import type { StepMessage } from "../app/usecase/step-message";

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
  .addOption(
    new Option("--user-agent <string>", "a string that contains a specific user agent")
  )
  .addOption(new Option("--headless", "enable headless mode"))
  .addOption(new Option("--no-quit", "turn off quit on finish"))
  .action(async ({ phone, gender, browser, proxy, userAgent, headless, quit }) => {
    const loginUsecase: LoginUsecase = container.get("login-usecase");

    const params: LoginParams = {
      browser,
      proxy,
      userAgent,
      headless,
      quit
    };

    if (phone) {
      params.phone = phone;
    }

    if (gender) {
      params.gender = gender;
    }

    const loginGenerator: AsyncGenerator<StepMessage> = loginUsecase.login(params);

    try {
      for await (const msg of loginGenerator) {
        console.log({
          ...msg,
          screenshot: msg.screenshot?.slice(-10)
        });
      }
    } catch (e) {
      if (e instanceof LoginUsecaseError) {
        console.log(e);

        return;
      }

      console.log("internal error: ", e);
    }
  });
