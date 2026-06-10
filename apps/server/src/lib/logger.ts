import pino from "pino";
import { config } from "../config/config";

//creating a logger
export const logger = pino({
  //setting the level according to the environment
  level: config.env === "production" ? "info" : "debug",
  transport:
    config.env !== "production" ? { target: "pino-pretty" } : undefined,
});
