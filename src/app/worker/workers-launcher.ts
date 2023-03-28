import { MessageListener } from "./message-listener";

export interface WorkersLauncherConfig<T> {
  scenario: string,
  paramsIterator: Iterator<T>,
  workersCount: number,
  retriesCount: number,
  getParamsKey: (jobIndex: number, params: any) => string,
  messageListeners: MessageListener[]
}

export interface WorkersLauncher {
  launch<T extends object>(config: WorkersLauncherConfig<T>): Promise<void>;
}
