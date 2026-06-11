import { Job, Worker } from "bullmq";
import { config } from "../../../config/config";
import { bullmqConnection } from "../../../infrastructure/queue/connection";
import { logger } from "../../../lib/logger";
import { userDLQ } from "./clerk.dlq";
import { User_Jobs } from "./clerk.types";
import {
  addClerkUser,
  deleteClerkUser,
  updateClerkUser,
} from "./clerk.service";
import { User } from "@repo/shared-types";
import { AppError } from "../../../utils/AppError";

const processJob = async (job: Job<User>) => {
  switch (job.name) {
    case User_Jobs.Create_User:
      await addClerkUser(job.data);
      return;
    case User_Jobs.Update_User:
      await updateClerkUser(job.data);
      return;
    case User_Jobs.Delete_User:
      await deleteClerkUser(job.data._id);
      return;
    default:
      throw new AppError(405, `Unsupported job: ${job.name}`);
  }
};

//crating a worker
export const userWorker = new Worker(
  `${config.bullmqPrefix}_clerk-user`,
  processJob,
  {
    connection: bullmqConnection,
    concurrency: 5,
  },
);

//check the worker ready state
userWorker.on("ready", () => {
  logger.info("clerk worker is ready");
});

//on the worker successfully perfrom the task
userWorker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, jobName: job.name },
    "clerk webhook job completed",
  );
});

//on worker failed to perfrom task
userWorker.on("failed", (job, error) => {
  //send the job to the dlq
  if (job && job.attemptsMade >= job.opts.attempts!) {
    userDLQ.add("user-dlq-data", {
      jobId: job?.id,
      jobName: job?.name,
      data: job?.data,
      error: error.message,
    });
    logger.error(
      {
        jobId: job?.id,
        jobName: job?.name,
        error: error.message,
      },
      "clerk webhook job failed",
    );
  }
});

userWorker.on("error", (err) => {
  logger.error({ message: "worker error", err });
});
