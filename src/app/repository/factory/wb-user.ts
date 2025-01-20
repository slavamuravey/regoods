import { WbUserRepositoryImpl } from "../impl/wb-user";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class WbUserRepositoryFactory implements ServiceFactory {
  create(container: ServiceContainer): WbUserRepositoryImpl {
    return new WbUserRepositoryImpl();
  }
}
