import { Scenario, scenarioGeneratorFactories } from "../../scenario/scenario";
import { StepMessage } from "../../scenario/step-message";
import { ExitCodeInternalError, ExitCodeSuccess, ExitCodeScenarioError } from "../exit-code";
import { ScenarioError } from "../../scenario/error";

export interface JobMessageListenerMessage {
  scenario: Scenario;
  params: any;
}

process.on("message", async ({ scenario, params }: JobMessageListenerMessage) => {
  if (!scenarioGeneratorFactories.has(scenario)) {
    throw new Error(`scenario "${scenario}" is unknown`);
  }

  const factory = scenarioGeneratorFactories.get(scenario)!;
  const generator: AsyncGenerator<StepMessage> = factory(params);

  let exitCode = ExitCodeSuccess;

  try {
    for await (const msg of generator) {
      console.log(msg);
      process.send!(msg);
    }
  } catch (e) {
    if (e instanceof ScenarioError) {
      exitCode = ExitCodeScenarioError;
      console.error(e);

      return;
    }

    exitCode = ExitCodeInternalError;
    console.error("internal error: ", e);
  } finally {
    process.exit(exitCode);
  }
});
