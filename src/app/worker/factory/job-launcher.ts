import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { stderrFileLogStreamFactory, stdoutFileLogStreamFactory } from "../log-stream-factory";
import { JobLauncherImpl } from "../impl/job-launcher";

export class JobLauncherFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new JobLauncherImpl(stdoutFileLogStreamFactory, stderrFileLogStreamFactory);
  }
}
