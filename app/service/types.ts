export interface CodeReceiver {
  receiveCode(phone: string): Promise<string | unknown>;
}

export interface RentResult {
  phone: string;
}

export interface PhoneRenter {
  rent(): Promise<RentResult>;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export type Gender = "man" | "woman";

export interface RandomNameGenerator {
  generate(gender?: Gender): Promise<Name>;
}
