export interface ProfileParams {
  wbUserId: string;
}

export interface ProfileUsecase {
  profile(params: ProfileParams): Promise<void>;
}
