import { IWebDriverCookie } from "selenium-webdriver";

export interface WbUserSession {
  id: string;
  phone: string;
  cookies: IWebDriverCookie[];
  userAgent: string;
}
