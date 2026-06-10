import { Socket } from "socket.io";
import { logger } from "../../lib/logger";

//creating a disconnect handler
export const handleDisconnect = (socket: Socket) => {
  logger.info(`Disconnected ${socket.id}`);
};
