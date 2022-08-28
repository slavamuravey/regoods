import { ProfileUsecaseImpl } from "../impl/profile";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserRepository } from "../../repository/wb-user";

export class ProfileUsecaseFactory implements ServiceFactory {
  create(container: Container): ProfileUsecaseImpl {
    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");

    return new ProfileUsecaseImpl(wbUserRepository);
  }
}
