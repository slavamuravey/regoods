export interface StepMessage {
  action: Action;
  screenshot?: string;
  description?: string;
}

export interface Action {
  type: string;
  params?: any;
}
