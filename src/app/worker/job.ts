import { scenarioGeneratorFactories } from "../usecase/scenario";
import { StepMessage } from "../usecase/step-message";
import { ExitCodeInternalError, ExitCodeSuccess, ExitCodeUsecaseError } from "./exit-code";
import { UsecaseError } from "../usecase/error";

process.on("message", async ({ scenario, params }) => {
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
    if (e instanceof UsecaseError) {
      exitCode = ExitCodeUsecaseError;
      console.error(e);

      return;
    }

    exitCode = ExitCodeInternalError;
    console.error("internal error: ", e);
  } finally {
    process.exit(exitCode);
  }
});
