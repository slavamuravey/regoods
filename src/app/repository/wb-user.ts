import type { WbUser } from "../entity/wb-user";
import { IWebDriverCookie } from "selenium-webdriver";

export interface CreatePayload {
  id: string;
  cookies: IWebDriverCookie[];
}

export interface UpdatePayload {
  cookies?: IWebDriverCookie[];
}

export interface WbUserRepository {
  find(id: string): Promise<WbUser>;

  create(payload: CreatePayload): Promise<WbUser>;

  update(id: string, payload: UpdatePayload): Promise<void>;
}

export class WbUserNotFoundError extends Error {
  constructor(userId: string) {
    super(`user "${userId}" is not found.`);
    this.name = this.constructor.name;
  }
}

export class WbUserAlreadyExists extends Error {
  constructor(userId: string) {
    super(`user "${userId}" already exists.`);
    this.name = this.constructor.name;
  }
}