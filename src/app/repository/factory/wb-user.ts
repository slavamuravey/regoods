import { WbUserRepositoryImpl } from "../impl/wb-user";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class WbUserRepositoryFactory implements ServiceFactory {
  create(container: Container): WbUserRepositoryImpl {
    return new WbUserRepositoryImpl();
  }
}
