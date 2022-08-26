import { Command, Option } from "commander";
import { container } from "../app/service-container";
import { ThenableWebDriver } from "selenium-webdriver";
import type { LoginParams, LoginUsecase } from "../app/usecase/login";
import { StepMessage } from "../app/usecase/step-message";
import { LoginUsecaseError } from "../app/usecase/login";

export const loginCmd = new Command();

loginCmd
  .name("login")
  .description("login user, if phone is empty, new user will be created")
  .addOption(new Option("--phone <string>", "user's phone number, ex. 79231234567"))
  .addOption(new Option("--gender <string>", "user's gender").choices(["man", "woman"]))
  .action(({ phone, gender }) => {
    (async () => {
      const driver: ThenableWebDriver = container.get("selenium-webdriver");
      const loginUsecase: LoginUsecase = container.get("login-usecase");

      const params: LoginParams = {};

      if (phone) {
        params.wbUserId = phone;
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
      } finally {
        driver.quit();
      }
    })();
  });

