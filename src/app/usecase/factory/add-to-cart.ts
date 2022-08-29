import { AddToCartUsecaseImpl } from "../impl/add-to-cart";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserRepository } from "../../repository/wb-user";

export class AddToCartUsecaseFactory implements ServiceFactory {
  create(container: Container): AddToCartUsecaseImpl {
    const wbUserRepository: WbUserRepository = container.get("wb-user-repository");

    return new AddToCartUsecaseImpl(wbUserRepository);
  }
}
