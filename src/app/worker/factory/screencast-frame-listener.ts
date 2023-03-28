import type { Container, ServiceFactory } from "../../../libs/service-container/types";
import { ScreencastFrameListenerImpl } from "../impl/screencast-frame-listener";

export class ScreencastFrameListenerFactory implements ServiceFactory {
  create(container: Container) {
    return new ScreencastFrameListenerImpl();
  }
}
