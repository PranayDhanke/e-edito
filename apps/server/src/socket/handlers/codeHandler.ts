import { SocketEvent } from "@repo/shared-types";
import { Server, Socket } from "socket.io";
import { codeService } from "../services/code.service";

export const handleCodeChange = async (socket: Socket, code: Uint8Array) => {
  //take the room code first
  const roomCode = socket.data.roomCode;

  if (!roomCode) {
    return socket.emit(SocketEvent.ERROR, {
      code: "ROOM_CODE_NOT_FOUND",
      message: "error while fetching the room code from the socket",
    });
  }

  if (!code) {
    return socket.emit(SocketEvent.ERROR, {
      code: "REQ_CODE_NOT_FOUND",
      message: "code not found",
    });
  }

  codeService.codeChangeService(socket, code, roomCode);
};
