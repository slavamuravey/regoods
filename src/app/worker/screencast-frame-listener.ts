import { storeScreencastFrame } from "../../utils/utils";

export interface ScreencastFrameListener {
  onScreencastFrame(jobId: string, data: string, frameIndex: number): Promise<void>;
}

export class ScreencastFrameListenerImpl implements ScreencastFrameListener {
  async onScreencastFrame(jobId: string, data: string, frameIndex: number) {
    await storeScreencastFrame(jobId, `screencast-frame-${frameIndex}.png`, data);
  }
}