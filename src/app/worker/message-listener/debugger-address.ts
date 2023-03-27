import { ChildProcess } from "child_process";
import { DebuggerAddressNotificationStepMessageType, StepMessage } from "../../usecase/step-message";
import { ScreencastLauncher } from "../screencast-launcher";
import type { MessageListener } from "./message-listener";

export class DebuggerAddressMessageListener implements MessageListener {
  constructor(
    private readonly screencastLauncher: ScreencastLauncher,
    private readonly withScreencast: (params: any) => boolean
  ) {}

  async on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: any) {
    if (msg.type === DebuggerAddressNotificationStepMessageType) {
      if (this.withScreencast(params)) {
        const [host, port] = msg.data.debuggerAddress.split(":");

        this.screencastLauncher.launch(jobId, host, port);
      }
    }
  }
}