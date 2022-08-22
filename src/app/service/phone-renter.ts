export interface RentResult {
  phone: string;
}

export interface PhoneRenter {
  rent(): Promise<RentResult>;
}
