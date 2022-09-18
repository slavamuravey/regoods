import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { ProxyRepositoryImpl } from "../impl/proxy";

export class ProxyRepositoryFactory implements ServiceFactory {
  create(container: Container): ProxyRepositoryImpl {
    return new ProxyRepositoryImpl();
  }
}
