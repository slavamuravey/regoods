export interface Name {
  firstName: string;
  lastName: string;
}

export type Gender = "man" | "woman";

export interface RandomNameGenerator {
  generate(gender?: Gender): Promise<Name>;
}
