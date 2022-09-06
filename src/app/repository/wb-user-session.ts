import type { WbUserSession } from "../entity/wb-user-session";
import { IWebDriverCookie } from "selenium-webdriver";

export interface WbUserSessionCreatePayload {
  phone: string;
  cookies: IWebDriverCookie[];
  userAgent: string;
}

export interface WbUserSessionUpdatePayload {
  cookies?: IWebDriverCookie[];
  userAgent?: string;
}

export interface WbUserSessionRepository {
  findOneByPhone(phone: string): Promise<WbUserSession>;

  create(payload: WbUserSessionCreatePayload): Promise<WbUserSession>;

  update(phone: string, payload: WbUserSessionUpdatePayload): Promise<void>;
}

export class WbUserSessionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
