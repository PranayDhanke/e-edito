import Redis from "ioredis";
import { config } from "./config";
import { logger } from "../lib/logger";

//creting a redis connection for the cache
export const redis = new Redis(config.redisUrl);

//create a redis connection for the redis publisher
export const pubClient = redis.duplicate();

//create a redis connection for the redis subscriber
export const subClient = redis.duplicate();

export async function initializeRedis() {
  try {
    await redis.ping();

    logger.info("Redis initialized");
  } catch (error) {
    logger.fatal("Redis startup failed");

    throw error;
  }
}

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("error", (err) => {
  logger.error(err, "Redis error");
});

redis.on("end", () => {
  logger.error("Redis connection closed");
});
