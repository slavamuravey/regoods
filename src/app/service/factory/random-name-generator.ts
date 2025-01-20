import { RandomNameGeneratorImpl } from "../impl/random-name-generator";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class RandomNameGeneratorFactory implements ServiceFactory {
  create(container: ServiceContainer): RandomNameGeneratorImpl {
    return new RandomNameGeneratorImpl(container.get("random-data-tools-client"));
  }
}
