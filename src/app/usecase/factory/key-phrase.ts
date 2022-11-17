import { KeyPhraseUsecaseImpl } from "../impl/key-phrase";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class KeyPhraseUsecaseFactory implements ServiceFactory {
  create(container: Container): KeyPhraseUsecaseImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new KeyPhraseUsecaseImpl(wbUserSessionRepository, proxyResolver);
  }
}
