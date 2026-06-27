"use client";
import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { disconnectSocket, getSocket } from "./socket";

//create the new context for the socket
const SocketCotext = createContext<Socket | null>(null);

//creating a provider for the socket context
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  //creating a state to store a socket
  const [socket, setSocket] = useState<Socket | null>(null);

  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const connect = async () => {
      //take the token from the clerk
      const token = await getToken();

      if (!token) {
        return;
      }

      const socketInstance = getSocket(token!);

      socketInstance.connect();

      setSocket(socketInstance);
    };

    connect();

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [isSignedIn, getToken]);

  return (
    <SocketCotext.Provider value={socket}>{children}</SocketCotext.Provider>
  );
};

//creating a hook to access the socket in the application
export const useSocket = () => {
  return useContext(SocketCotext);
};
