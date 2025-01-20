import { Client as RandomDataToolsClient } from "../../../libs/random-data-tools";
import { environment } from "../../environment/environment";
import type { ServiceContainer, ServiceFactory } from "vorarbeiter";

export class RandomDataToolsClientFactory implements ServiceFactory {
  create(container: ServiceContainer): RandomDataToolsClient {
    return new RandomDataToolsClient(environment.api.randomDataTools.fetch);
  }
}
