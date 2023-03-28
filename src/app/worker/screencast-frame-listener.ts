export interface ScreencastFrameListener {
  onScreencastFrame(jobId: string, data: string, frameIndex: number): Promise<void>;
}
