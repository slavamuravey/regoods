import fs from "fs";
import type { WbUserRepository } from "../wb-user";
import type { WbUser } from "../../entity/wb-user";
import { createUsersDirPath } from "../../../utils/utils";

export class WbUserRepositoryImpl implements WbUserRepository {
  async findAll(): Promise<WbUser[]> {
    const files = await fs.promises.readdir(createUsersDirPath());

    return files.map((phone) => ({
      phone
    }));
  }
}
