import { CodeScenarioImpl } from "../impl/code";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class CodeScenarioFactory implements ServiceFactory {
  create(container: Container): CodeScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new CodeScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
