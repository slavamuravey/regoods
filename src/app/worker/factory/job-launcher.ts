import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { stderrFileLogStreamFactory, stdoutFileLogStreamFactory } from "../log-stream-factory";
import { JobLauncherImpl } from "../impl/job-launcher";

export class JobLauncherFactory implements ServiceFactory {
  create(container: Container) {
    return new JobLauncherImpl(stdoutFileLogStreamFactory, stderrFileLogStreamFactory);
  }
}
