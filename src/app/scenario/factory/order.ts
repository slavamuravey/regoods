import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";
import { OrderScenarioImpl } from "../impl/order";

export class OrderScenarioFactory implements ServiceFactory {
  create(container: ServiceContainer): OrderScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new OrderScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
