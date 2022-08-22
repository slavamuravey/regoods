export type Gender = "man" | "woman";

export interface LoginParams {
  wbUserId?: string;
  gender?: Gender;
}

export interface LoginUsecase {
  login(params: LoginParams): Promise<void>;
}
