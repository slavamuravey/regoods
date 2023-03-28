import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { WorkersLauncherImpl } from "../impl/workers-launcher";

export class WorkersLauncherFactory implements ServiceFactory {
  create(container: Container) {
    return new WorkersLauncherImpl(container.get("job-launcher"));
  }
}
