import { CreateMessageFormInput, CreateMessageInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { AppError } from "../../utils/AppError";
import { LogService } from "../activity_logs/activity-log.service";
import { roomRepo } from "../room/room.repo";
import { messageRepo } from "./message.repo";

const createMessageService = async (
  roomCode: string,
  reqData: CreateMessageFormInput,
  userId: string,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const data: CreateMessageInput = {
    room_code: roomCode,
    sender_id: userId,
    message: reqData.message,
    type: reqData.type || "TEXT",
  };

  const res = await messageRepo.addMessageRepo(data);

  if (!res) {
    throw new AppError(500, "failed to create message");
  }

  const logRes = await LogService.addLogService({
    action: "MESSAGE_CREATED",
    room_code: roomCode,
    user_id: userId,
    metadata: {
      message_id: res._id,
      type: data.type,
    },
  });

  if (!logRes) {
    throw new AppError(500, "failed to create message log");
  }

  return res;
};

const getRoomMessagesService = async (
  roomCode: string,
  reqFilter: cursorFilters,
) => {
  const room = await roomRepo.getRoomRepo(roomCode);

  if (!room) {
    throw new AppError(404, "room not found");
  }

  const filter: cursorFilters = {
    ...reqFilter,
    limit: Number(reqFilter.limit) || 20,
  };

  const res = await messageRepo.getRoomMessagesRepo(roomCode, filter);

  if (!res) {
    throw new AppError(500, "failed to get room messages");
  }

  return res;
};

export const messageService = {
  createMessageService,
  getRoomMessagesService,
};
