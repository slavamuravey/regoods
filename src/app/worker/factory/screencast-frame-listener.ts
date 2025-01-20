import type { ServiceContainer, ServiceFactory } from "vorarbeiter";
import { ScreencastFrameListenerImpl } from "../impl/screencast-frame-listener";

export class ScreencastFrameListenerFactory implements ServiceFactory {
  create(container: ServiceContainer) {
    return new ScreencastFrameListenerImpl();
  }
}
