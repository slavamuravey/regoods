export interface Locker {
  lock(): void;
  unlock(): void;
  getPromise(): Promise<void>;
}
