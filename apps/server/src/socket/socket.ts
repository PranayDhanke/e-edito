import { Server as httpServer } from "http";
import { Server as ioServer } from "socket.io";
import { config } from "../config/config";
import { addSocketAdapter } from "./adapter";
import { handleConnect } from "./handler/connectionHandler";
import { handleDisconnect } from "./handler/disconnectHandler";
import { SocketEvent } from "@repo/shared-types";
import { socketAuth } from "./socket.auth";

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

  //adding the socket methods
  //handle connect
  io.on(SocketEvent.CONNECTION, (socket) => {
    handleConnect(socket);

    //handle disconnect
    socket.on(SocketEvent.DISCONNECT, () => {
      handleDisconnect(socket);
    });
  });

  return io;
};
