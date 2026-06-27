import { SocketEvent } from "@repo/shared-types";
import { Server, Socket } from "socket.io";
import { JoinSocketRoomInput, joinSocketRoomSchema } from "@repo/validation";
import { roomService } from "../services/room.service";

export const handleRoomConnection = async (
  io: Server,
  socket: Socket,
  data: JoinSocketRoomInput,
) => {
  //take the user id from the socket data
  const id = socket.data.userId;

  //check if id exists
  if (!id) {
    return socket.emit(SocketEvent.ERROR, {
      code: "AUTHORIZATION_ERROR",
      message: "user id not found",
    });
  }

  //validate the room code
  const result = joinSocketRoomSchema.safeParse(data);

  if (!result.success) {
    return socket.emit(SocketEvent.ERROR, {
      code: "VALIDATION_ERROR",
      message: result.error.issues[0].message,
    });
  }

  await roomService.roomConnectionService(io, socket, id, data);
};

export const handleRoomDisconnect = async (io: Server, socket: Socket) => {
  //take the user id from the socket data
  const id = socket.data.userId;

  //check if id exists
  if (!id) {
    return socket.emit(SocketEvent.ERROR, {
      code: "AUTHORIZATION_ERROR",
      message: "user id not found",
    });
  }

  //validate the room code
  const roomCode = socket.data.roomCode;

  if (!roomCode) {
    return socket.emit(SocketEvent.ERROR, {
      code: "VALIDATION_ERROR",
      message: "Room code not found",
    });
  }

  await roomService.roomDisconnectionService(io, socket, id, roomCode);
};
