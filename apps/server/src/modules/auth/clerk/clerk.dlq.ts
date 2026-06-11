import { Queue } from "bullmq";
import { config } from "../../../config/config";

//creating a dlq for the clerk user
export const userDLQ = new Queue(`${config.bullmqPrefix}_clerk-user-dlq`);
