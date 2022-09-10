export interface CodeReceiver {
  receiveCode(phone: string): Promise<string>;
}
