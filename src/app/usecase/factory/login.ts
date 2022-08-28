import { LoginUsecaseImpl } from "../impl/login";
import { CodeReceiver } from "../../service/code-receiver";
import { PhoneRenter } from "../../service/phone-renter";
import { RandomNameGenerator } from "../../service/random-name-generator";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserRepository } from "../../repository/wb-user";

export class LoginUsecaseFactory implements ServiceFactory {
  create(container: Container): LoginUsecaseImpl {
    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");
    const codeReceiver: CodeReceiver = container.get("code-receiver");
    const phoneRenter: PhoneRenter = container.get("phone-renter");
    const randomNameGenerator: RandomNameGenerator = container.get("random-name-generator");

    return new LoginUsecaseImpl(wbUserRepository, codeReceiver, phoneRenter, randomNameGenerator);
  }
}
