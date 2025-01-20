import { ProfileScenarioImpl } from "../impl/profile";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class ProfileScenarioFactory implements ServiceFactory {
  create(container: ServiceContainer): ProfileScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new ProfileScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
