import type { WbUser } from "../entity/wb-user";

export interface WbUserRepository {
  findAll(): Promise<WbUser[]>;
}
