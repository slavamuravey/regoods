import { ChildProcess } from "child_process";
import { DebuggerAddressNotificationStepMessageType, StepMessage } from "../../../scenario/step-message";
import { ScreencastLauncher } from "../../screencast-launcher";
import type { MessageListener } from "../../message-listener";
import type { ScreencastParams } from "../../params";

export class DebuggerAddressMessageListener implements MessageListener {
  constructor(
    private readonly screencastLauncher: ScreencastLauncher,
    private readonly withScreencast: (params: ScreencastParams) => boolean
  ) {}

  async on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: ScreencastParams) {
    if (msg.type === DebuggerAddressNotificationStepMessageType) {
      if (this.withScreencast(params)) {
        const [host, port] = msg.data.debuggerAddress.split(":");

        this.screencastLauncher.launch(jobId, host, port);
      }
    }
  }
}