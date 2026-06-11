import { Queue } from "bullmq";
import { config } from "../../../config/config";
import { bullmqConnection } from "../../../infrastructure/queue/connection";
import { QueueJobOptions } from "../../../infrastructure/queue/queueConfig";

//creating a new queue for the clerk
export const userQueue = new Queue(`${config.bullmqPrefix}_clerk-user`, {
  connection: bullmqConnection,
  defaultJobOptions: QueueJobOptions,
});
