import fs from "fs";
import { createUserIdDirPath, createCookiesFilePath } from "../../utils/utils";
import type { UpdatePayload, CreatePayload, WbUserRepository } from "../wb-user";
import type { WbUser } from "../../entity/wb-user";
import { WbUserAlreadyExists, WbUserNotFoundError } from "../wb-user";

export class WbUserRepositoryImpl implements WbUserRepository {
  async find(id: string): Promise<WbUser> {
    const userIdDir = createUserIdDirPath(id);

    try {
      await fs.promises.access(userIdDir, fs.constants.F_OK);
    } catch {
      throw new WbUserNotFoundError(id);
    }

    const cookies = await fs.promises.readFile(createCookiesFilePath(id), { encoding: "utf8" });

    return {
      id,
      cookies: JSON.parse(cookies)
    };
  }

  async create(payload: CreatePayload): Promise<WbUser> {
    const { id: phone, cookies } = payload;

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

    await this.update(phone, { cookies });

    return {
      id: phone,
      cookies
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
