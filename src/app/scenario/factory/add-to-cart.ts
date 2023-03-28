import { AddToCartScenarioImpl } from "../impl/add-to-cart";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class AddToCartScenarioFactory implements ServiceFactory {
  create(container: Container): AddToCartScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new AddToCartScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
