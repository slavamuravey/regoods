import { IWebDriverCookie } from "selenium-webdriver";

export interface WbUser {
  id: string;
  cookies?: IWebDriverCookie[];
}
