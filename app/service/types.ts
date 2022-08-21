export interface CodeReceiver {
  receiveCode(phone: string): Promise<string | unknown>;
}

export interface RentResult {
  phone: string;
}

export interface PhoneRenter {
  rent(): Promise<RentResult>;
}
