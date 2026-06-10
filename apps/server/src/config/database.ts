import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "../lib/logger";

//creting a function to connect mongodb
export async function connectDatabase() {
  try {
    //connect to the mongodb
    await mongoose.connect(config.mongodbUri);

    logger.info("MongoDB connected");
  } catch (error) {
    //handle the errors
    logger.fatal("MongoDB connection failed");
    throw error;
  }
}

//function to disconnect mongodb
export async function disconnectDatabase() {
  try {
    //close the connection
    await mongoose.connection.close();

    logger.info("MongoDB disconnected");
  } catch (error) {
    //hadle unexpected errors
    logger.error(error, "MongoDB disconnect failed");
  }
}
