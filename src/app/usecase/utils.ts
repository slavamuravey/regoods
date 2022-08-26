import type { Action, StepMessage } from "./step-message";

export function createStepMessage(action: Action, description: string, screenshot?: string): StepMessage {
  return {
    action,
    description,
    screenshot
  }
}
