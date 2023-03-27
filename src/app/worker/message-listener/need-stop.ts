import { NeedStopProcessStepMessageType, StepMessage } from "../../usecase/step-message";
import { ChildProcess } from "child_process";
import type { MessageListener } from "./message-listener";

export class NeedStopMessageListener implements MessageListener {
  async on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: any) {
    if (msg.type === NeedStopProcessStepMessageType) {
      process.kill(childProcess.pid!, "SIGSTOP");
    }
  }
}
