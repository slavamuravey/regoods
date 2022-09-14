import { container } from "../service-container";
import { LoginUsecaseError } from "../usecase/login";
import type { StepMessage } from "../usecase/step-message";
import type { LoginParams, LoginUsecase } from "../usecase/login";

process.on("message", async ({ phone, gender, browser, proxy, userAgent, headless, quit }) => {
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
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof LoginUsecaseError) {
      console.error(e);

      return;
    }

    console.error("internal error: ", e);
  } finally {
    process.exit();
  }
});