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
    super(userId);
    this.name = this.constructor.name;
    this.message = `user "${userId}" is not found.`;
  }
}

export class WbUserAlreadyExists extends Error {
  constructor(userId: string) {
    super(userId);
    this.name = this.constructor.name;
    this.message = `user "${userId}" already exists.`;
  }
}