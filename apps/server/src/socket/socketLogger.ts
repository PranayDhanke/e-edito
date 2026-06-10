import { logger } from "../lib/logger";

export const socketLogger = (socketId: string, event: string) => {
  logger.info({ id: socketId, event: event });
};
