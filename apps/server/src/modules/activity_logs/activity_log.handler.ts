import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { LogService } from "./activity-log.service";

//handler function to get the user log
export const getUserLogHandler = async (req: Request, res: Response) => {
  //take the user id from the req header
  const userId = req.userId;

  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const logs = await LogService.getUserLogService(userId);

  res.status(200).json({
    success: true,
    data: logs,
  });
};

//handler function to get the room log
export const getRoomLogHandler = async (req: Request, res: Response) => {
  //take the user id from the req header
  const roomCode = req.params.roomCode;

  if (!roomCode) {
    throw new AppError(401, "Unauthorized");
  }

  const logs = await LogService.getUserLogService(roomCode as string);

  res.status(200).json({
    success: true,
    data: logs,
  });
};
