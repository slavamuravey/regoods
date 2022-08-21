export type Gender = "man" | "woman";

export interface LoginParams {
  wbUserId?: string;
  gender?: Gender;
}

export interface ProfileParams {
  wbUserId: string;
}
