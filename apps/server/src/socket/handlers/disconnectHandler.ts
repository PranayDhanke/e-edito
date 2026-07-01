import { Socket } from "socket.io";
import { logger } from "../../lib/logger";
import { roomService } from "../services/room.service";
import { Server } from "socket.io";
import { reconnectService } from "../services/reconnect.service";
import { SocketEvent } from "@repo/shared-types";

//creating a disconnect handler
export const handleDisconnect = async (io: Server, socket: Socket, r: any) => {
  const userId = socket.data.userId;
  const roomCode = socket.data.roomCode;
  const isLeavingRoom = socket.data.isLeavingRoom;

  if (userId && roomCode && !isLeavingRoom) {
    const timeout = setTimeout(async () => {
      try {
        await roomService.roomDisconnectionService(io, socket, userId, roomCode);
        socket.to(roomCode).emit(SocketEvent.USER_LEFT_RES, userId);
      } finally {
        reconnectService.removePendingDisconnect(roomCode, userId);
      }
    }, 5000);

    reconnectService.setPendingDisconnect(roomCode, userId, timeout);
  }

  logger.info({
    socket: socket.id,
    user: userId,
    room: roomCode,
    reason: r,
  });
};
