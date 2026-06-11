import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  if (socket) return;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    autoConnect: false,
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();

  socket = null;
};
