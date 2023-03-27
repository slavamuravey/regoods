import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { ScreencastLauncherImpl } from "../screencast-launcher";
import { stderrFileLogStreamFactory, stdoutFileLogStreamFactory } from "../log-stream-factory";

export class ScreencastLauncherFactory implements ServiceFactory {
  create(container: Container) {
    return new ScreencastLauncherImpl(stdoutFileLogStreamFactory, stderrFileLogStreamFactory);
  }
}
