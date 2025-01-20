import { WbUserSessionRepositoryImpl } from "../impl/wb-user-session";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class WbUserSessionRepositoryFactory implements ServiceFactory {
  create(container: ServiceContainer): WbUserSessionRepositoryImpl {
    return new WbUserSessionRepositoryImpl();
  }
}
