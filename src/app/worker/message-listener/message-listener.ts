import type { StepMessage } from "../../usecase/step-message";
import { ChildProcess } from "child_process";

export interface MessageListener {
  on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: any): Promise<void>;
}
