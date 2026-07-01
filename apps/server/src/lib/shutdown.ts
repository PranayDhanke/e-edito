import { Server as httpServer } from "http";
import { logger } from "../lib/logger";
import { pubClient, redis, subClient } from "../config/redis";
import { Server as ioServer } from "socket.io";
import { disconnectDatabase } from "../config/database";
import { closeWorkers } from "../infrastructure/worker";

//adding fixed timeout for the shutdown
const shutdown_timeout = 10_000;

//creting varible to check if the server is already shutting down or not
let isShuttingDown = false;

//new function with promise to close the server
const closeServer = (httpserver: httpServer): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    httpserver.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const closeIoServer = (ioserver: ioServer): Promise<void> => {
  return new Promise<void>((resolve) => {
    ioserver.close(() => {
      resolve();
    });
  });
};

//creting a shutdown to use the gracefull shutdown
export async function gracefulShutdown(server: httpServer, io: ioServer) {
  //check if alreadt shuddown
  if (isShuttingDown) {
    logger.warn("Shutdown already in progress");
    return;
  }
  isShuttingDown = true;

  logger.info("Shutdown initilized");

  //adding force shudown if time limit exceeds
  const forceShutdown = setTimeout(() => {
    logger.error(`Shutdown timed out after ${shutdown_timeout}ms`);

    process.exit(1);
  }, shutdown_timeout);

  try {
    //closing the io server as well as http server
    await closeIoServer(io);
    logger.info("server closed");

    //closing the database connection
    await disconnectDatabase();
    logger.info("databse connections closed");

    //closing the workers
    await closeWorkers();
    logger.info("workers closed");

    //closing the redis connection
    await Promise.all([redis.quit(), pubClient.quit(), subClient.quit()]);
    logger.info("Redis connections closed");

    //clear the timeout if connection close on time
    clearTimeout(forceShutdown);

    //terminate the current code
    process.exit(0);
  } catch (error) {
    //handling the unexpected errors

    //clear the timeout if any error
    clearTimeout(forceShutdown);
    logger.error(error);
    process.exit(1);
  }
}
