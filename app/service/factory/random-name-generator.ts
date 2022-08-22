import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { RandomNameGeneratorImpl } from "../impl/random-name-generator";

export class RandomNameGeneratorFactory implements ServiceFactory {
  create(container: Container): RandomNameGeneratorImpl {
    return new RandomNameGeneratorImpl(container.get("random-data-tools-client"));
  }
}
