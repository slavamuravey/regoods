import { RandomNameGeneratorImpl } from "../impl/random-name-generator";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class RandomNameGeneratorFactory implements ServiceFactory {
  create(container: Container): RandomNameGeneratorImpl {
    return new RandomNameGeneratorImpl(container.get("random-data-tools-client"));
  }
}
