import { WbUserRepository } from "../../repository/wb-user";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class WbUserRepositoryFactory implements ServiceFactory {
  create(container: Container): WbUserRepository {
    return new WbUserRepository();
  }
}
