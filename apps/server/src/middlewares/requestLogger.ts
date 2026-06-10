import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";

//creating the logger middleware to log the incoming http request
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //taking the current time and date
  const start = Date.now();

  //adding event on request complete
  res.on("finish", () => {
    //calculate the total time required to complete the request
    const duration = Date.now() - start;

    //logging the request details 
    if (res.statusCode >= 500) {
      logger.error(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    } else if (res.statusCode >= 400) {
      logger.warn(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    } else {
      logger.info(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      );
    }
  });

  //calling the next function for the further execution
  next();
};
