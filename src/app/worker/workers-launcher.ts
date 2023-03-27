import fs from "fs";
import { ExitCodeInternalError } from "./exit-code";
import { JobLauncher } from "./job-launcher";
import { MessageListener } from "./message-listener/message-listener";
import path from "path";
import { createDataDirPath } from "../../utils/utils";

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

export class WorkersLauncherImpl implements WorkersLauncher {
  constructor(private readonly jobLauncher: JobLauncher) {}

  async launch<T extends object>({
    scenario,
    paramsIterator,
    workersCount,
    retriesCount,
    getParamsKey,
    messageListeners
  }: WorkersLauncherConfig<T>) {
    let jobIndex = 0;
    const errorFilePath = path.resolve(createDataDirPath(), `${scenario}_errors.txt`);
    await fs.promises.writeFile(errorFilePath, "");

    const retriesMap = new WeakMap<T, number>();
    const paramsRetriesList: T[] = [];

    const takeParams = () => {
      let params = paramsRetriesList.pop();

      if (params !== undefined) {
        return params;
      }

      const { value } = paramsIterator.next();

      return value;
    };

    const launchWorker = async () => {
      const params = takeParams();
      if (params === undefined) {
        return;
      }

      const child = this.jobLauncher.launch(getParamsKey(jobIndex, params), scenario, params, messageListeners);
      const exitCode = await new Promise((resolve) => {
        child.on("exit", (code) => {
          resolve(Number(code));
        });
      });

      const serializedParams = Object.entries(params).map(entry => entry.join(": ")).join(", ");
      console.log(`(${serializedParams}) child ${child.pid} finished with code ${exitCode}`);

      if (exitCode === ExitCodeInternalError) {
        if (!retriesMap.has(params)) {
          retriesMap.set(params, retriesCount);
        }

        const paramsRetries = retriesMap.get(params)!;

        if (paramsRetries > 0) {
          retriesMap.set(params, paramsRetries - 1);
          paramsRetriesList.push(params);
        } else {
          await fs.promises.appendFile(errorFilePath, `${serializedParams}\n`);
        }
      }

      jobIndex++;

      process.nextTick(launchWorker);
    }

    for (let i = 0; i < workersCount; i++) {
      launchWorker();
    }
  }
}