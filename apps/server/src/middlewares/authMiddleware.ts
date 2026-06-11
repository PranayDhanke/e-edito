import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

//creating the auth middlware to verify the clerk user and set the user id to the request
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = getAuth(req);

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "unauthorized ",
    });
  }

  req.userId = userId.userId?.toString();

  next();
};
