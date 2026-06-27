import { Socket } from "socket.io";
import { logger } from "../../lib/logger";
import { roomService } from "../services/room.service";
import { Server } from "socket.io";

//creating a disconnect handler
export const handleDisconnect = async (io: Server, socket: Socket, r: any) => {
  logger.info(`Disconnected ${socket.id} , reason is ${r}`);
};
