import { Job, Worker } from "bullmq";
import { config } from "../../config/config";
import { bullmqConnection } from "../../infrastructure/queue/connection";
import { redis } from "../../config/redis";
import { redisRoomService } from "../../services/redis/room.redis";
import { logger } from "../../lib/logger";

export const cleanWorker = new Worker(
  config.bullmqPrefix + "cleaner-queue",
  async (_job: Job) => {
    const roomCodes = await redis.smembers("rooms");

    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    for (const roomCode of roomCodes) {
      const roomData = await redis.get(`room:${roomCode}`);

      if (!roomData) {
        await redisRoomService.delSroom(roomCode);
        continue;
      }

      const room = JSON.parse(roomData);

      if (now - room.last_activity > ONE_HOUR) {
        await Promise.all([
          redisRoomService.deleteRoom(roomCode),
          redisRoomService.delSroom(roomCode),
        ]);
        logger.info(`Deleted inactive room ${roomCode}`);
      }
    }
  },
  {
    connection: bullmqConnection,
  },
);
