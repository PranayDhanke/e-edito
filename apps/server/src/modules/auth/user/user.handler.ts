import { Request, Response } from "express";
import { getUserService } from "./user.service";
import { AppError } from "../../../utils/AppError";

//creating a get me handler to get the data of the current user
export const getMeHandler = async (req: Request, res: Response) => {
  //get the user id from the request
  const userId = req.userId;

  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }
//taking the data from the service
  const user = await getUserService(userId);

  res.status(200).json({ success: true, data: user });
};

//creating a get me handler to get the data of the current user
export const getUserHandler = async (req: Request, res: Response) => {
  //get the user id from the request params
  const userId = req.params.userId;

  if (!userId) {
    throw new AppError(401, "Failed to get the id");
  }

  //taking the data from the service
  const user = await getUserService(userId as string);

  res.status(200).json({ success: true, data: user });
};
