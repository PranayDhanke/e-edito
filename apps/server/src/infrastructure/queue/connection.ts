import Redis from "ioredis";
import { config } from "../../config/config";
import { logger } from "../../lib/logger";

//adding the new redis connection for the bull mq
export const bullmqConnection = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,

  retryStrategy(times) {
    return Math.min(times * 50, 3000);
  },
});

bullmqConnection.on("connect", () => {
  logger.info("Bullmq Redis connected");
});

bullmqConnection.on("ready", () => {
  logger.info("Bullmq Redis ready");
});

bullmqConnection.on("reconnecting", () => {
  logger.warn("Bullmq Redis reconnecting...");
});

bullmqConnection.on("error", (err) => {
  logger.error(err, "Bullmq Redis error");
});

bullmqConnection.on("end", () => {
  logger.error("Bullmq Redis connection closed");
});
