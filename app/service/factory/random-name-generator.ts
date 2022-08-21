import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { RandomNameGenerator } from "../random-name-generator";

export class RandomNameGeneratorFactory implements ServiceFactory {
  create(container: Container): RandomNameGenerator {
    return new RandomNameGenerator(container.get("random-data-tools-client"));
  }
}
