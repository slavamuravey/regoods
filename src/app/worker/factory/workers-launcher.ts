import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { WorkersLauncherImpl } from "../impl/workers-launcher";

export class WorkersLauncherFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new WorkersLauncherImpl(container.get("job-launcher"));
  }
}
