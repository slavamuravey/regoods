import { fork } from "child_process";
import path from "path";
import { LogStreamFactory } from "./log-stream-factory";

export interface ScreencastLauncher {
  launch(jobId: string, host: string, port: number): void;
}

export class ScreencastLauncherImpl implements ScreencastLauncher {
  constructor(
    private readonly stdoutLogStreamFactory: LogStreamFactory,
    private readonly stderrLogStreamFactory: LogStreamFactory,
  ) {}

  launch(jobId: string, host: string, port: number) {
    const screencast = fork(path.resolve(__dirname, "./screencast"), { silent: true });
    screencast.stdout!.pipe(this.stdoutLogStreamFactory(jobId));
    screencast.stderr!.pipe(this.stderrLogStreamFactory(jobId));
    screencast.send({ jobId, debuggerAddress: { host, port} });
  }
}