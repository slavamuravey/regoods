import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { stderrFileLogStreamFactory, stdoutFileLogStreamFactory } from "../log-stream-factory";
import { ScreencastLauncherImpl } from "../impl/screencast-launcher";

export class ScreencastLauncherFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new ScreencastLauncherImpl(stdoutFileLogStreamFactory, stderrFileLogStreamFactory);
  }
}
