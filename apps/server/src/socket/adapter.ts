import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "../config/redis";

//create a function toconnect the apdater to pub sub
export const addSocketAdapter = (io: Server) => {
    //creating and adding the adapter to the socket with the pub sub
  io.adapter(createAdapter(pubClient, subClient));
};
