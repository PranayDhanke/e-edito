import { Socket } from "socket.io";
import { AppError } from "../utils/AppError";
import { verifyToken } from "@clerk/express";
import { config } from "../config/config";

//verify the clerk jwt token
const verifyId = async (token: string) => {
  const payload = verifyToken(token, {
    secretKey: config.clerkSecretKey,
  });

  return (await payload).sub;
};

//creating the socket auth middleare for the secure socket connections
export const socketAuth = async (socket: Socket, next: (err?: any) => void) => {
  try {
    //take the token from the socket added from the client
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new AppError(401, "unauthorized"));
    }

    const userId = await verifyId(token);

    socket.data.userId = userId;

    next();
  } catch (error) {
    next(new AppError(501, "server error"));
  }
};
