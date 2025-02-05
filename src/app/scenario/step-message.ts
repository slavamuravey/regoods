export interface StepMessage {
  type: string;
  description: string;
  data?: any;
}

export const NeedStopProcessStepMessageType = "need-stop-process";

export class NeedStopProcess implements StepMessage {
  type = NeedStopProcessStepMessageType;

  constructor(public readonly description: string) {}
}

export const DebuggerAddressNotificationStepMessageType = "debugger-address-notification";

export interface DebuggerAddress {
  debuggerAddress: string;
}

export class DebuggerAddressNotification implements StepMessage {
  type = DebuggerAddressNotificationStepMessageType;

  constructor(public readonly description: string, public readonly data: DebuggerAddress) {}
}

export const BrowserActionNotificationStepMessageType = "browser-action-notification";

export class BrowserActionNotification implements StepMessage {
  type = BrowserActionNotificationStepMessageType;

  constructor(public readonly description: string, readonly data?: any) {}
}

export const DeliveryItemNotificationStepMessageType = "delivery-item-notification";

export interface DeliveryItem {
  phone: string;
  profileName: string;
  size: string;
  sizeRu: string;
  address: string;
  code: string;
  status: string;
  vendorCode: string;
}

export class DeliveryItemNotification implements StepMessage {
  type = DeliveryItemNotificationStepMessageType;

  constructor(public readonly description: string, public readonly data: DeliveryItem) {}
}

export const OrderItemNotificationStepMessageType = "order-item-notification";

export interface OrderItem {
  phone: string;
  vendorCode: string;
  name: string;
  price: string;
  size: string;
  orderDate: string;
  receiveDate: string;
  status: string;
}

export class OrderItemNotification implements StepMessage {
  type = OrderItemNotificationStepMessageType;

  constructor(public readonly description: string, public readonly data: OrderItem) {}
}
