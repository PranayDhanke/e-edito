import {
  CreateBannedParticipantFormInput,
  CreateRoomFormInput,
  CreateRoomInput,
  JoinRoomParticipantInput,
  UpdateRoomParticipantInput,
} from "@repo/validation";

import { nanoid } from "nanoid";
import { AppError } from "../../utils/AppError";
import { roomRepo } from "./room.repo";
import { participantService } from "../participant/participant.service";
import { versionService } from "../versions/version.service";
import { LogService } from "../activity_logs/activity-log.service";
import { RoomFilters } from "@repo/shared-types";
import { bannedParticipantService } from "../banned_participant/banned-participant.service";
import { redisRoomService } from "../../services/redis/room.redis";

//creating service function to create a new room
const createRoomService = async (
  reqdata: CreateRoomFormInput,
  userId: string,
) => {
  //generate the new room id of 8 chars
  const roomCode = nanoid(8);

  //creating a new data with all fields
  const data: CreateRoomInput = {
    ...reqdata,
    room_code: roomCode,
    status: "active",
    owner_id: userId,
    participantCount: 1,
  };

  //call the repo function
  const createRes = await roomRepo.createRoomRepo(data);

  if (!createRes) {
    throw new AppError(501, "error while creating a new room");
  }

  //add the owener as participant
  const participantRes = await participantService.createParticipantService({
    room_code: roomCode,
    role: "owner",
    user_id: userId,
    invited_by: null,
  });

  if (!participantRes) {
    throw new AppError(501, "error while creating a new owner participant");
  }

  //add the version for the room
  const versionRes = await versionService.addVersionService(
    {
      code: reqdata.code,
      name: "v0 created",
      language: reqdata.language,
      reason: "room creation version",
      room_code: roomCode,
    },
    userId,
  );

  if (!versionRes) {
    throw new AppError(
      501,
      "error while creating a new version while room creation",
    );
  }

  const logRes = await LogService.addLogService({
    action: "ROOM_CREATED",
    room_code: roomCode,
    user_id: userId,
    metadata: {
      first_version: versionRes,
      owner_info: participantRes,
    },
  });

  if (!logRes) {
    throw new AppError(
      501,
      "error while creating a new log while room creation",
    );
  }

  await redisRoomService.addRoom(roomCode, reqdata.code, reqdata.language);
  await redisRoomService.addParticipant(roomCode, userId, "owner");

  return createRes;
};

//creating a service function to get the room details
const getRoomService = async (roomCode: string, userId?: string) => {
  if (userId) {
    const participant =
      await participantService.getRoomParticipantByUserService(
        roomCode,
        userId,
      );

    if (!participant) {
      throw new AppError(
        501,
        "Unauthorized room entry please join as participant",
      );
    }
  }

  const res = await roomRepo.getRoomRepo(roomCode);

  if (!res) {
    throw new AppError(501, "error while getting the room details ");
  }

  return res;
};

//creating a service function to get the room details
const getRoomIdService = async (userId: string, reqFilter: RoomFilters) => {
  //matching the filters

  const filter: RoomFilters = {
    ...reqFilter,
    limit: reqFilter.limit || 10,
  };

  const res = await roomRepo.getRoomIdRepo(userId, filter);

  if (!res) {
    throw new AppError(501, "error while getting the room details ");
  }

  return res;
};

//function to get the participants in room
const getRoomParticipantsService = async (roomCode: string) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const res = await participantService.getRoomParticipantsService(roomCode);

  if (!res) {
    throw new AppError(501, "error while getting the room participants");
  }

  return res;
};

//function to join new  user to the room
const joinRoomService = async (
  roomCode: string,
  userId: string,
  invitedBy: string | null,
  role: string | null,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const bannedParticipant =
    await bannedParticipantService.getBannedParticipantService(
      roomCode,
      userId,
    );

  if (bannedParticipant) {
    throw new AppError(403, "participant is banned from this room");
  }

  const existingParticipant =
    await participantService.getRoomParticipantByUserService(roomCode, userId);

  if (existingParticipant) {
    return existingParticipant;
  }

  const data: JoinRoomParticipantInput = {
    room_code: roomCode,
    role: role === "editor" ? "editor" : "viewer",
    invited_by: invitedBy,
  };

  const res = await participantService.joinParticipantService(data, userId);
  await redisRoomService.addParticipant(data.room_code, userId, data.role);

  const logRes = await LogService.addLogService({
    action: "USER_JOINED",
    room_code: roomCode,
    user_id: userId,
    metadata: {
      invited_by: invitedBy,
      participant_id: res._id,
    },
  });

  if (!logRes) {
    throw new AppError(501, "error while creating join room log");
  }

  return res;
};

//function to remove the room participants
const removeRoomParticipantService = async (
  roomCode: string,
  participantUserId: string,
  actorUserId?: string,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const res = await participantService.deleteRoomParticipantService(
    roomCode,
    participantUserId,
  );

  await redisRoomService.removeParticipant(roomCode, participantUserId);

  if (actorUserId) {
    const logRes = await LogService.addLogService({
      action: "PARTICIPANT_REMOVED",
      room_code: roomCode,
      user_id: actorUserId,
      metadata: {
        participant_user_id: participantUserId,
      },
    });
    if (!logRes) {
      throw new AppError(501, "error while creating remove participant log");
    }
  }

  const logRes = await LogService.addLogService({
    action: "USER_LEFT",
    room_code: roomCode,
    metadata: {
      participant_user_id: participantUserId,
    },
    user_id: participantUserId,
  });
  if (!logRes) {
    throw new AppError(501, "error while creating remove participant log");
  }

  return res;
};

//function to update the room participant role
const updateRoomParticipantService = async (
  roomCode: string,
  participantUserId: string,
  actorUserId: string,
  data: UpdateRoomParticipantInput,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const res = await participantService.updateRoomParticipantService(
    roomCode,
    participantUserId,
    data,
  );

  const logRes = await LogService.addLogService({
    action: "PARTICIPANT_ROLE_CHANGED",
    room_code: roomCode,
    user_id: actorUserId,
    metadata: {
      participant_user_id: participantUserId,
      role: data.role,
    },
  });

  if (!logRes) {
    throw new AppError(501, "error while creating participant role log");
  }

  return res;
};

//function to ban the user from the room
const banRoomParticipantService = async (
  roomCode: string,
  participantUserId: string,
  actorUserId: string,
  data: CreateBannedParticipantFormInput,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const participant = await participantService.getRoomParticipantByUserService(
    roomCode,
    participantUserId,
  );

  if (participant) {
    await participantService.deleteRoomParticipantService(
      roomCode,
      participantUserId,
    );

    await redisRoomService.removeParticipant(roomCode, participantUserId);
  }

  const res = await bannedParticipantService.addBannedParticipantService({
    room_code: roomCode,
    user_id: participantUserId,
    banned_by: actorUserId,
    reason: data.reason,
    notes: data.notes ?? null,
  });

  const logRes = await LogService.addLogService({
    action: "USER_BANNED",
    room_code: roomCode,
    user_id: actorUserId,
    metadata: {
      participant_user_id: participantUserId,
      reason: data.reason,
      notes: data.notes ?? null,
    },
  });

  if (!logRes) {
    throw new AppError(501, "error while creating ban participant log");
  }

  return res;
};

export const roomService = {
  createRoomService,
  getRoomService,
  getRoomIdService,
  getRoomParticipantsService,
  joinRoomService,
  removeRoomParticipantService,
  updateRoomParticipantService,
  banRoomParticipantService,
};
