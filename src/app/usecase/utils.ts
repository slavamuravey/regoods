import type { StepMessage } from "./step-message";
import type { ThenableWebDriver } from "selenium-webdriver";
import type { IWebDriverCookie } from "selenium-webdriver";

export function createStepMessage(description: string): StepMessage {
  return {
    description,
  }
}

export async function getCookies(driver: ThenableWebDriver) {
  const cookies = await driver.manage().getCookies();
  const fixedCookies: IWebDriverCookie[] = cookies.map(cookie => {
    const fixedCookie = {
      ...cookie
    };

    // @ts-ignore
    if (fixedCookie?.sameSite === "None") {
      // @ts-ignore
      delete fixedCookie.sameSite;
    }

    return fixedCookie;
  });

  return fixedCookies;
}
