import { AddToCartScenarioImpl } from "../impl/add-to-cart";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class AddToCartScenarioFactory implements ServiceFactory {
  create(container: ServiceContainer): AddToCartScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new AddToCartScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
