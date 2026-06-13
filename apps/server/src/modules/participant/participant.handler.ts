import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { participantService } from "./participant.service";

export const getRoomParticipantsHandler = async (
  req: Request,
  res: Response,
) => {
  const roomCode = req.params.roomCode as string;

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const participants =
    await participantService.getRoomParticipantsService(roomCode);

  res.status(200).json({
    success: true,
    data: participants,
  });
};

export const deleteRoomParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const roomCode = req.params.roomCode as string;
  const userId = req.params.userId as string;

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  if (!userId?.trim()) {
    throw new AppError(400, "User id is required");
  }

  await participantService.deleteRoomParticipantService(roomCode, userId);

  res.status(200).json({
    success: true,
    message: "Participant removed successfully",
  });
};
