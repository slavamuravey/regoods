import fs from "fs";
import { createUserIdDirPath, createCookiesFilePath, createRentIdFilePath } from "../utils/utils";
import type { UpdatePayload, CreatePayload, WbUserRepository as WbUserRepositoryInterface } from "./types";
import type { WbUser } from "../entity/wb-user";
import { Client } from "../../libs/sms-activate/types";
import { WbUserAlreadyExists, WbUserNotFoundError } from "./error";

export class WbUserRepository implements WbUserRepositoryInterface {
  private smsActivateClient: Client;

  constructor(smsActivateClient: Client) {
    this.smsActivateClient = smsActivateClient;
  }

  async find(id: string): Promise<WbUser> {
    const userIdDir = createUserIdDirPath(id);

    try {
      await fs.promises.access(userIdDir, fs.constants.F_OK);
    } catch {
      throw new WbUserNotFoundError(id);
    }

    const result: WbUser = {
      id
    };

    let cookies;

    try {
      cookies = await fs.promises.readFile(createCookiesFilePath(id), { encoding: "utf8" });
      result.cookies = JSON.parse(cookies);
    } catch {
    }

    return result;
  }

  async create(payload: CreatePayload): Promise<WbUser> {
    let phone, rentId;

    if (!payload?.id) {
      const data = await this.smsActivateClient.getRentNumber({ service: "uu" });
      phone = data.phone.number;
      rentId = data.phone.id;
    } else {
      phone = payload.id;
    }

    const userIdDir = createUserIdDirPath(phone);

    let isUserExists;

    try {
      await fs.promises.access(userIdDir, fs.constants.F_OK);

      isUserExists = true;
    } catch {
      isUserExists = false;
    }

    if (isUserExists) {
      throw new WbUserAlreadyExists(phone);
    }

    await fs.promises.mkdir(userIdDir, { recursive: true });

    if (rentId) {
      await fs.promises.writeFile(createRentIdFilePath(phone), String(rentId));
    }

    await this.update(phone, { cookies: payload?.cookies });

    return {
      id: phone,
      cookies: payload?.cookies
    };
  }

  async update(id: string, payload: UpdatePayload): Promise<void> {
    const userIdDir = createUserIdDirPath(id);

    try {
      await fs.promises.access(userIdDir, fs.constants.F_OK);
    } catch {
      throw new WbUserNotFoundError(id);
    }

    if (payload.cookies) {
      await fs.promises.writeFile(createCookiesFilePath(id), JSON.stringify(payload.cookies));
    }
  }
}
