import { Client as RandomDataToolsClient } from "../../../libs/random-data-tools";
import { environment } from "../../environment/environment";
import type { Container, ServiceFactory } from "../../../libs/service-container/types";

export class RandomDataToolsClientFactory implements ServiceFactory {
  create(container: Container): RandomDataToolsClient {
    return new RandomDataToolsClient(environment.api.randomDataTools.fetch);
  }
}
