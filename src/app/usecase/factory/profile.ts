import { ProfileUsecaseImpl } from "../impl/profile";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class ProfileUsecaseFactory implements ServiceFactory {
  create(container: Container): ProfileUsecaseImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new ProfileUsecaseImpl(wbUserSessionRepository, proxyResolver);
  }
}
