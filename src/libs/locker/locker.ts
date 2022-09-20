import type { Locker as LockerInterface } from "./types";

export class Locker implements LockerInterface {
  private promise = Promise.resolve();
  private resolve: () => void = () => {};

  lock(): void {
    this.promise = new Promise<void>(resolve => {
      this.resolve = resolve;
    })
  }

  unlock(): void {
    this.resolve();
  }

  getPromise(): Promise<void> {
    return this.promise;
  }
}
