import { Request, Response } from "express";

//creating the not found handler
export const notFoundHandler = (
  req: Request,
  res: Response
) => {
  return res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route ${req.originalUrl} not found`,
    },
  });
};
