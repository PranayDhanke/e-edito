import { Queue } from "bullmq";
import { config } from "../../config/config";
import { bullmqConnection } from "../../infrastructure/queue/connection";
import { QueueJobOptions } from "../../infrastructure/queue/queueConfig";

export const cleanQueue = new Queue(config.bullmqPrefix + "cleaner-queue", {
  connection: bullmqConnection,
  defaultJobOptions: QueueJobOptions,
});
