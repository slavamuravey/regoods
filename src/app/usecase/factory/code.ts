import { CodeUsecaseImpl } from "../impl/code";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class CodeUsecaseFactory implements ServiceFactory {
  create(container: Container): CodeUsecaseImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new CodeUsecaseImpl(wbUserSessionRepository, proxyResolver);
  }
}
