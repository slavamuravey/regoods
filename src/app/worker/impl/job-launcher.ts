import type { JobLauncher } from "../job-launcher";
import type { LogStreamFactory } from "../log-stream-factory";
import type { MessageListener } from "../message-listener";
import { fork } from "child_process";
import path from "path";
import type { StepMessage } from "../../scenario/step-message";

export class JobLauncherImpl implements JobLauncher {
  constructor(
    private readonly stdoutLogStreamFactory: LogStreamFactory,
    private readonly stderrLogStreamFactory: LogStreamFactory,
  ) {}

  launch(key: string, scenario: string, params: any, messageListeners: MessageListener[]) {
    const child = fork(path.resolve(__dirname, "./job"), { silent: true });

    const jobId = `${key}-${process.pid}-${child.pid}-${scenario}`;

    child.stdout!.pipe(this.stdoutLogStreamFactory(jobId));
    child.stderr!.pipe(this.stderrLogStreamFactory(jobId));

    child.send({ scenario, params });
    for (const messageListener of messageListeners) {
      child.on("message", async (msg: StepMessage) => {
        await messageListener.on(msg, child, jobId, params);
      });
    }

    return child;
  }
}
