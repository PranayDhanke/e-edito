import { Socket } from "socket.io";
import { logger } from "../../lib/logger";

//creating the connection handler
export const handleConnect = (socket: Socket) => {
  logger.info(`Connected ${socket.id} and user id is ${socket.data.userId}`);
};
