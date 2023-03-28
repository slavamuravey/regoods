import { MessageListener } from "./message-listener";
import { ChildProcess } from "child_process";

export interface JobLauncher {
  launch(key: string, scenario: string, params: any, messageListeners: MessageListener[]): ChildProcess;
}
