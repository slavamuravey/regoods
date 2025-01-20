import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { ProxyRepositoryImpl } from "../impl/proxy";

export class ProxyRepositoryFactory implements ServiceFactory {
  create(container: ServiceContainer): ProxyRepositoryImpl {
    return new ProxyRepositoryImpl();
  }
}
