export interface StepMessage {
  type: string;
  description: string;
  data?: any;
}

export const NeedStopProcessStepMessageType = "need-stop-process";

export class NeedStopProcess implements StepMessage {
  type = NeedStopProcessStepMessageType;

  constructor(readonly description: string) {
    this.description = description;
  }
}

export const DebuggerAddressNotificationStepMessageType = "debugger-address-notification";

export interface DebuggerAddress {
  debuggerAddress: string;
}

export class DebuggerAddressNotification implements StepMessage {
  type = DebuggerAddressNotificationStepMessageType;

  constructor(readonly description: string, readonly data: DebuggerAddress) {
    this.description = description;
    this.data = data;
  }
}

export const BrowserActionNotificationStepMessageType = "browser-action-notification";

export class BrowserActionNotification implements StepMessage {
  type = BrowserActionNotificationStepMessageType;

  constructor(readonly description: string) {
    this.description = description;
  }
}
