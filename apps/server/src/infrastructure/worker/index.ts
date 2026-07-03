import { logger } from "../../lib/logger";
import { cleanQueue } from "../../socket/queue/room.queue";
import { cleanWorker } from "../../socket/worker/room.worker";
import { userWorker } from "../../modules/auth/clerk/clerk.worker";
import { executionWorker } from "../../modules/execution/execution.worker";

const CLEAN_ROOM_JOB_ID = "clear-inactive-rooms";
const CLEAN_ROOM_INTERVAL = 60 * 60 * 1000;

export const startWorkers = async () => {
  await Promise.all([
    userWorker.waitUntilReady(),
    cleanWorker.waitUntilReady(),
    executionWorker.waitUntilReady(),
  ]);

  await cleanQueue.add(
    CLEAN_ROOM_JOB_ID,
    {},
    {
      jobId: CLEAN_ROOM_JOB_ID,
      repeat: {
        every: CLEAN_ROOM_INTERVAL,
      },
    },
  );

  logger.info("workers initialized");
};

export const closeWorkers = async () => {
  await Promise.all([
    userWorker.close(),
    cleanWorker.close(),
    executionWorker.close(),
    cleanQueue.close(),
  ]);
};
