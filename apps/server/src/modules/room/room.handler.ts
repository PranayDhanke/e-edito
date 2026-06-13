import {
  CreateBannedParticipantFormInput,
  CreateRoomFormInput,
  UpdateRoomParticipantInput,
} from "@repo/validation";
import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { roomService } from "./room.service";
import { RoomFilters } from "@repo/shared-types";

//crating a handler function to create the new rooom
export const createRoomHandler = async (req: Request, res: Response) => {
  //take the user id from the req header
  const userId = req.userId;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  const data: CreateRoomFormInput = req.body;

  if (!data) {
    throw new AppError(401 , "req data not found")
  }

  const room = await roomService.createRoomService(data, userId);

  res.status(200).json({
    success: true,
    data: room,
  });
};

//room handler to get the room detail
export const getRoomHandler = async (req: Request, res: Response) => {
  //take the room id from the params
  const roomCode = req.params.roomCode as string;

  if (!roomCode.trim()) {
    throw new AppError(401, "Could not find the room code");
  }

  const room = await roomService.getRoomService(roomCode);

  res.status(201).json({
    success: true,
    data: room,
  });
};

export const getRoomIdHandler = async (req: Request, res: Response) => {
  //take the user id from the req header
  const userId = req.userId;

  const filter: RoomFilters = req.query;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  const rooms = await roomService.getRoomIdService(userId, filter);

  res.status(201).json({
    success: true,
    data: rooms,
  });
};

export const getRoomParticipantsHandler = async (
  req: Request,
  res: Response,
) => {
  const roomCode = (req.params.roomCode || req.params.roomId) as string;

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const participants = await roomService.getRoomParticipantsService(roomCode);

  res.status(200).json({
    success: true,
    data: participants,
  });
};

export const joinRoomHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const invitedBy = req.query.invitedBy as string | undefined;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const participant = await roomService.joinRoomService(
    roomCode,
    userId,
    invitedBy?.trim() || null,
  );

  res.status(201).json({
    success: true,
    data: participant,
  });
};

export const deleteRoomParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const actorUserId = req.userId;
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const participantUserId = (req.params.userId || req.params.id) as string;

  if (!actorUserId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  if (!participantUserId?.trim()) {
    throw new AppError(400, "User id is required");
  }

  await roomService.deleteRoomParticipantService(
    roomCode,
    participantUserId,
    actorUserId,
  );

  res.status(200).json({
    success: true,
    message: "Participant removed successfully",
  });
};

export const updateRoomParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const actorUserId = req.userId;
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const participantUserId = (req.params.userId || req.params.id) as string;
  const data: UpdateRoomParticipantInput = req.body;

  if (!actorUserId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  if (!participantUserId?.trim()) {
    throw new AppError(400, "User id is required");
  }

  const participant = await roomService.updateRoomParticipantService(
    roomCode,
    participantUserId,
    actorUserId,
    data,
  );

  res.status(200).json({
    success: true,
    data: participant,
  });
};

export const banRoomParticipantHandler = async (
  req: Request,
  res: Response,
) => {
  const actorUserId = req.userId;
  const roomCode = (req.params.roomCode || req.params.roomId) as string;
  const participantUserId = (req.params.userId || req.params.id) as string;
  const data: CreateBannedParticipantFormInput = req.body;

  if (!actorUserId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  if (!participantUserId?.trim()) {
    throw new AppError(400, "User id is required");
  }

  const bannedParticipant = await roomService.banRoomParticipantService(
    roomCode,
    participantUserId,
    actorUserId,
    data,
  );

  res.status(201).json({
    success: true,
    data: bannedParticipant,
  });
};
