import { AddToCartUsecaseImpl } from "../impl/add-to-cart";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import type { WbUserSessionRepository } from "../../repository/wb-user-session";

export class AddToCartUsecaseFactory implements ServiceFactory {
  create(container: Container): AddToCartUsecaseImpl {
    const wbUserSessionRepository: WbUserSessionRepository = container.get("wb-user-session-repository");

    return new AddToCartUsecaseImpl(wbUserSessionRepository);
  }
}
