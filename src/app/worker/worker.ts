export interface WorkerRunResponse {
  pid: number;
  result: Promise<number>;
}
