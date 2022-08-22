import { ProfileUsecaseImpl } from "../impl/profile";
import { ThenableWebDriver } from "selenium-webdriver";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserRepository } from "../../repository/wb-user";

export class ProfileUsecaseFactory implements ServiceFactory {
  create(container: Container): ProfileUsecaseImpl {
    const driver: ThenableWebDriver = container.get("selenium-webdriver");
    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");

    return new ProfileUsecaseImpl(driver, wbUserRepository);
  }
}
