import { LoginScenarioImpl } from "../impl/login";
import { CodeReceiver } from "../../service/code-receiver";
import { PhoneRenter } from "../../service/phone-renter";
import { RandomNameGenerator } from "../../service/random-name-generator";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";
import type { ProxyResolver } from "../../service/proxy-resolver";

export class LoginScenarioFactory implements ServiceFactory {
  create(container: Container): LoginScenarioImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");
    const codeReceiver: CodeReceiver = container.get("code-receiver");
    const phoneRenter: PhoneRenter = container.get("phone-renter");
    const randomNameGenerator: RandomNameGenerator = container.get("random-name-generator");
    const proxyResolver: ProxyResolver = container.get("proxy-resolver");

    return new LoginScenarioImpl(wbUserSessionRepository, codeReceiver, phoneRenter, randomNameGenerator, proxyResolver);
  }
}
