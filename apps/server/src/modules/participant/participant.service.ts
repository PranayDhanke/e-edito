import {
  CreateRoomParticipantInput,
  JoinRoomParticipantInput,
  UpdateRoomParticipantInput,
} from "@repo/validation";
import { AppError } from "../../utils/AppError";
import { participantRepo } from "./participant.repo";

//creating a service function to create a new participant
export const createParticipantService = async (
  data: CreateRoomParticipantInput,
) => {
  const res = await participantRepo.addParticipantRoomRepo(data);

  if (!res) {
    throw new AppError(500, "failed to add participant");
  }

  return res;
};

//creating a service function to join a new participant
export const joinParticipantService = async (
  reqData: JoinRoomParticipantInput,
  userId: string,
) => {
  const data: CreateRoomParticipantInput = {
    ...reqData,
    user_id: userId,
  };

  const res = await participantRepo.addParticipantRoomRepo(data);

  if (!res) {
    throw new AppError(500, "failed to add participant");
  }

  return res;
};

export const getRoomParticipantsService = async (roomCode: string) => {
  const res = await participantRepo.getRoomParticipantsRepo(roomCode);

  if (!res) {
    throw new AppError(500, "failed to get room participants");
  }

  return res;
};

export const getRoomParticipantByUserService = async (
  roomCode: string,
  userId: string,
) => {
  return await participantRepo.getRoomParticipantByUserRepo(roomCode, userId);
};

export const deleteRoomParticipantService = async (
  roomCode: string,
  userId: string,
) => {
  const res = await participantRepo.deleteRoomParticipantRepo(userId, roomCode);

  if (!res.deletedCount) {
    throw new AppError(404, "participant not found");
  }

  return res;
};

export const updateRoomParticipantService = async (
  roomCode: string,
  userId: string,
  data: UpdateRoomParticipantInput,
) => {
  if (!data.role) {
    throw new AppError(400, "participant role is required");
  }

  const res = await participantRepo.changeParticipantRoleRepo(
    userId,
    roomCode,
    data.role,
  );

  if (!res.matchedCount) {
    throw new AppError(404, "participant not found");
  }

  return res;
};

export const participantService = {
  createParticipantService,
  joinParticipantService,
  getRoomParticipantsService,
  getRoomParticipantByUserService,
  deleteRoomParticipantService,
  updateRoomParticipantService,
};
