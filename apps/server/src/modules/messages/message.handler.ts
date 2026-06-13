import { CreateMessageFormInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { messageService } from "./message.service";

export const createMessageHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const data: CreateMessageFormInput = req.body;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const message = await messageService.createMessageService(
    roomCode,
    data,
    userId,
  );

  res.status(201).json({
    success: true,
    data: message,
  });
};

export const getRoomMessagesHandler = async (req: Request, res: Response) => {
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const filter: cursorFilters = req.query;

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const messages = await messageService.getRoomMessagesService(roomCode, filter);

  res.status(200).json({
    success: true,
    data: messages,
  });
};
