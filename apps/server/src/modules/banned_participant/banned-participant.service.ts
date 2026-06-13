import { CreateBannedParticipantInput } from "@repo/validation";
import { AppError } from "../../utils/AppError";
import { bannedParticipantRepo } from "./banned-participant.repo";

const addBannedParticipantService = async (
  data: CreateBannedParticipantInput,
) => {
  const existingBan = await bannedParticipantRepo.getBannedParticipantRepo(
    data.room_code,
    data.user_id,
  );

  if (existingBan) {
    throw new AppError(409, "participant already banned");
  }

  const res = await bannedParticipantRepo.addBannedParticipantRepo(data);

  if (!res) {
    throw new AppError(500, "failed to ban participant");
  }

  return res;
};

const getBannedParticipantService = async (roomCode: string, userId: string) => {
  return await bannedParticipantRepo.getBannedParticipantRepo(roomCode, userId);
};

export const bannedParticipantService = {
  addBannedParticipantService,
  getBannedParticipantService,
};
