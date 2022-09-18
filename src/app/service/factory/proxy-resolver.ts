import { ProxyResolverImpl } from "../impl/proxy-resolver";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class ProxyResolverFactory implements ServiceFactory {
  create(container: Container): ProxyResolverImpl {
    return new ProxyResolverImpl(container.get("proxy-repository"));
  }
}
