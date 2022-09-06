import { WbUserSessionRepositoryImpl } from "../impl/wb-user-session";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class WbUserSessionRepositoryFactory implements ServiceFactory {
  create(container: Container): WbUserSessionRepositoryImpl {
    return new WbUserSessionRepositoryImpl();
  }
}
