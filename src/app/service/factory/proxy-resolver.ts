import { ProxyResolverImpl } from "../impl/proxy-resolver";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class ProxyResolverFactory implements ServiceFactory {
  create(container: ServiceContainer): ProxyResolverImpl {
    return new ProxyResolverImpl(container.get("proxy-repository"));
  }
}
