import fs from "fs";
import { ExitCodeInternalError } from "./exit-code";

export interface WorkerRunResult {
  pid: number;
  result: Promise<number>;
}

export async function runWorkers<T extends object>(
  paramsIterator: Iterator<T>,
  workerRunFn: (params: T) => WorkerRunResult,
  count: number,
  retries: number,
  errorFilePath: string
) {
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

  const runWorker = async () => {
    const params = takeParams();
    if (params === undefined) {
      return;
    }

    const serializedParams = Object.entries(params).map(entry => entry.join(": ")).join(", ");

    const { pid, result } = workerRunFn(params);
    const code = await result;
    console.log(`(${serializedParams}) child ${pid} finished with code ${code}`);

    if (code === ExitCodeInternalError) {
      if (!retriesMap.has(params)) {
        retriesMap.set(params, retries);
      }

      const paramsRetries = retriesMap.get(params)!;

      if (paramsRetries > 0) {
        retriesMap.set(params, paramsRetries - 1);
        paramsRetriesList.push(params);
      } else {
        await fs.promises.appendFile(errorFilePath, `${serializedParams}\n`);
      }
    }

    process.nextTick(runWorker);
  }

  for (let i = 0; i < count; i++) {
    runWorker();
  }
}