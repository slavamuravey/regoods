import fs from "fs";
import path from "path";
import { createLogDirPath } from "../../utils/utils";

export type LogStreamFactory = (jobId: string) => fs.WriteStream;

export const stdoutFileLogStreamFactory = (jobId: string) => {
  return fs.createWriteStream(path.resolve(createLogDirPath(), `${jobId}-stdout.log`), { flags: "a" });
};

export const stderrFileLogStreamFactory = (jobId: string) => {
  return fs.createWriteStream(path.resolve(createLogDirPath(), `${jobId}-stderr.log`), { flags: "a" });
};
