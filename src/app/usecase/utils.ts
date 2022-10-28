import type { IWebDriverCookie, ThenableWebDriver } from "selenium-webdriver";
import { Condition, WebDriver } from "selenium-webdriver";

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

export function createWait(driver: ThenableWebDriver, timeout?: number, message?: string) {
  return function <T>(
    condition: PromiseLike<T> | Condition<T> | ((driver: WebDriver) => T | PromiseLike<T>) | Function,
  ): Promise<T> {
    return driver.wait(condition, timeout, message);
  };
}
