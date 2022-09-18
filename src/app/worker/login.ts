import { container } from "../service-container";
import type { LoginParams, LoginUsecase } from "../usecase/login";
import type { StepMessage } from "../usecase/step-message";

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
      process.send!({ msg, err: null });
    }
  } catch (e) {
    if (e instanceof Error) {
      process.send!({
        msg: null,
        err: {
          name: e.name,
          message: e.message,
          stack: e.stack
        }
      });

      return;
    }

    throw e;
  } finally {
    process.exit();
  }
});