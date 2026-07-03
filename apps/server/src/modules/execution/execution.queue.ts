import { Queue } from "bullmq";
import { config } from "../../config/config";
import { bullmqConnection } from "../../infrastructure/queue/connection";
import { QueueJobOptions } from "../../infrastructure/queue/queueConfig";

export const executionQueue = new Queue(
  `${config.bullmqPrefix}_code-execution`,
  {
    connection: bullmqConnection,
    defaultJobOptions: QueueJobOptions,
  },
);
