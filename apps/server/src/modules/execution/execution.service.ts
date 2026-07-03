import { QueueEvents } from "bullmq";
import { ExecuteCodeInput } from "@repo/validation";
import { config } from "../../config/config";
import { bullmqConnection } from "../../infrastructure/queue/connection";
import { AppError } from "../../utils/AppError";
import { executionQueue } from "./execution.queue";
import { ExecutionResult } from "./execution.types";

const queueEvents = new QueueEvents(`${config.bullmqPrefix}_code-execution`, {
  connection: bullmqConnection,
});

const executeCodeService = async (
  data: ExecuteCodeInput,
): Promise<ExecutionResult> => {
  const job = await executionQueue.add("run-code", data);

  try {
    const result = (await job.waitUntilFinished(
      queueEvents,
      20_000,
    )) as ExecutionResult;

    return result;
  } catch (error) {
    throw new AppError(
      500,
      error instanceof Error ? error.message : "Failed to execute code",
    );
  }
};

export const executionService = {
  executeCodeService,
};
