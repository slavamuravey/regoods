import fs from "fs";

export interface WorkerRunResult {
  pid: number;
  result: Promise<number>;
}

export async function runWorkers<T extends object>(
  paramsList: T[],
  workerRunFn: (params: T) => WorkerRunResult,
  count: number,
  retries: number,
  errorFilePath: string
) {
  await fs.promises.writeFile(errorFilePath, "");

  const retriesMap = new WeakMap<T, number>();

  const runWorker = async () => {
    const params = paramsList.pop();
    if (params === undefined) {
      return;
    }

    const serializedParams = Object.entries(params).map(entry => entry.join(": ")).join(", ");

    const { pid, result } = workerRunFn(params);
    const code = await result;
    console.log(`(${serializedParams}) child ${pid} finished with code ${code}`);

    if (code !== 0) {
      if (!retriesMap.has(params)) {
        retriesMap.set(params, retries);
      }

      if (retriesMap.get(params)! > 0) {
        retriesMap.set(params, --retries);
        paramsList.push(params);
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