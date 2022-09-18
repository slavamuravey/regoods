import fs from "fs";
import {
  createCookiesFilePath,
  createUserAgentFilePath,
  createUsersDirPath, createUserSessionDirPath,
  createUserSessionsDirPath,
  storeCookies,
  storeUserAgent
} from "../../../utils/utils";
import type {
  WbUserSessionCreatePayload,
  WbUserSessionRepository,
  WbUserSessionUpdatePayload
} from "../wb-user-session";
import { WbUserSessionNotFoundError } from "../wb-user-session";
import type { WbUserSession } from "../../entity/wb-user-session";
import { v4 as uuid } from "uuid";

export class WbUserSessionRepositoryImpl implements WbUserSessionRepository {
  async findOneByPhone(phone: string): Promise<WbUserSession> {
    const userSessionsDir = createUserSessionsDirPath(phone);

    const sessions = await fs.promises.readdir(userSessionsDir);
    const id = sessions[0];

    try {
      await fs.promises.access(createUserSessionDirPath(phone, id), fs.constants.F_OK);
    } catch {
      throw new WbUserSessionNotFoundError(`session with id "${id}" for phone "${phone}" is not found.`);
    }

    const cookies = await fs.promises.readFile(createCookiesFilePath(phone, id), { encoding: "utf8" });
    const userAgent = await fs.promises.readFile(createUserAgentFilePath(phone, id), { encoding: "utf8" });

    return {
      id,
      phone,
      userAgent,
      cookies: JSON.parse(cookies)
    };
  }

  async create(payload: WbUserSessionCreatePayload): Promise<WbUserSession> {
    const { phone, cookies, userAgent } = payload;
    const id = uuid();

    await storeCookies(phone, id, JSON.stringify(cookies));
    await storeUserAgent(phone, id, userAgent);

    return {
      id,
      phone,
      userAgent,
      cookies
    };
  }

  async update(id: string, payload: WbUserSessionUpdatePayload): Promise<void> {
    const { cookies, userAgent } = payload;

    const phones = await fs.promises.readdir(createUsersDirPath());

    for (const phone of phones) {
      const sessions = await fs.promises.readdir(createUserSessionsDirPath(phone));
      for (const session of sessions) {
        if (id === session) {
          if (cookies) {
            await storeCookies(phone, id, JSON.stringify(cookies));
          }

          if (userAgent) {
            await storeUserAgent(phone, id, userAgent);
          }

          return;
        }
      }
    }

    throw new WbUserSessionNotFoundError(`session "${id}" is not found.`);
  }
}
