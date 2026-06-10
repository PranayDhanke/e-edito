import http from "http";
import app from "./app";
import { config } from "./config/config";
import { logger } from "./lib/logger";
import { gracefulShutdown } from "./utils/shutdown";
import { initializeSocket } from "./socket/socket";
import { initializeRedis } from "./config/redis";
import { connectDatabase } from "./config/database";

//creating a new http server with express
const server = http.createServer(app);

//creating a server bootstrap
async function startServer() {
  try {
    //initilizing redis
    await initializeRedis();
    
    //add database connection
    await connectDatabase()

    //adding the socket connection
    const io = initializeSocket(server);

    //starting the server on specied port
    server.listen(config.port, () => {
      logger.info(`starting the server on port ${config.port} `);
    });

    //adding the gracefull shutdown
    process.on("SIGTERM", async () => {
      await gracefulShutdown(server, io);
    });

    process.on("SIGINT", async () => {
      await gracefulShutdown(server, io);
    });
  } catch (error) {
    //handle the unexpected errors
    logger.fatal(error);

    process.exit(1);
  }
}
//start server
startServer();
