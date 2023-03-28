import type { ScreencastFrameListener } from "../screencast-frame-listener";
import { storeScreencastFrame } from "../../../utils/utils";

export class ScreencastFrameListenerImpl implements ScreencastFrameListener {
  async onScreencastFrame(jobId: string, data: string, frameIndex: number) {
    await storeScreencastFrame(jobId, `screencast-frame-${frameIndex}.png`, data);
  }
}
