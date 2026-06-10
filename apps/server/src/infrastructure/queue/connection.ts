import Redis from "ioredis";
import { config } from "../../config/config";
import { logger } from "../../lib/logger";

//adding the new redis connection for the bull mq
export const bullConnection = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
});

bullConnection.on("connect", () => {
  logger.info("Bullmq Redis connected");
});

bullConnection.on("ready", () => {
  logger.info("Bullmq Redis ready");
});

bullConnection.on("reconnecting", () => {
  logger.warn("Bullmq Redis reconnecting...");
});

bullConnection.on("error", (err) => {
  logger.error(err, "Bullmq Redis error");
});

bullConnection.on("end", () => {
  logger.error("Bullmq Redis connection closed");
});
