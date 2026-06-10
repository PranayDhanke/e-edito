import { NextFunction, Request, Response } from "express";

import { logger } from "../lib/logger";
import { AppError } from "../utils/AppError";

//creating a middleware to handle errors
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message: "Internal Server error ",
  });
};
