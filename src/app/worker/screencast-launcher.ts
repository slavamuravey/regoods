export interface ScreencastLauncher {
  launch(jobId: string, host: string, port: number): void;
}
