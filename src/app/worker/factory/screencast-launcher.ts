import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { stderrFileLogStreamFactory, stdoutFileLogStreamFactory } from "../log-stream-factory";
import { ScreencastLauncherImpl } from "../impl/screencast-launcher";

export class ScreencastLauncherFactory implements ServiceFactory {
  create(container: Container) {
    return new ScreencastLauncherImpl(stdoutFileLogStreamFactory, stderrFileLogStreamFactory);
  }
}
