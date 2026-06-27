import { Server as httpServer } from "http";
import { Server as ioServer } from "socket.io";
import { config } from "../config/config";
import { addSocketAdapter } from "./adapter";
import { handleConnect } from "./handlers/connectionHandler";
import { handleDisconnect } from "./handlers/disconnectHandler";
import { SocketEvent } from "@repo/shared-types";
import { socketAuth } from "./socket.auth";
import {
  handleRoomConnection,
  handleRoomDisconnect,
} from "./handlers/roomHandler";
import { JoinSocketRoomInput } from "@repo/validation";
import { roomService } from "./services/room.service";
import { setSocketServer } from "./socket-instance";
import { handleCodeChange } from "./handlers/codeHandler";
import { startCodeSave } from "./worker/codeSave.worker";

//creating a function to initialize socket
export const initializeSocket = (server: httpServer) => {
  //crating a new socket connection
  const io = new ioServer(server, {
    cors: { origin: config.clientUrl },
    transports: ["websocket"],
  });

  //adding the middleware
  io.use(socketAuth);

  //adding the adapter
  addSocketAdapter(io);
  setSocketServer(io);

  startCodeSave(3000);

  //adding the socket methods
  //handle connect
  io.on(SocketEvent.CONNECTION, (socket) => {
    handleConnect(socket);

    socket.on(SocketEvent.JOIN_ROOM, (data: JoinSocketRoomInput) => {
      handleRoomConnection(io, socket, data);
    });

    socket.on(SocketEvent.LEAVE_ROOM, () => {
      handleRoomDisconnect(io, socket);
    });

    socket.on(SocketEvent.CODE_CHANGE, (code: Uint8Array) => {
      handleCodeChange(socket, code);
    });

    //handle disconnect
    socket.on(SocketEvent.DISCONNECT, (reason: any) => {
      handleDisconnect(io, socket, reason);
    });
  });

  return io;
};
