import { KeyPhraseScenarioImpl } from "../impl/key-phrase";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class KeyPhraseScenarioFactory implements ServiceFactory {
  create(container: Container): KeyPhraseScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new KeyPhraseScenarioImpl(wbUserSessionRepository, proxyResolver);
  }
}
