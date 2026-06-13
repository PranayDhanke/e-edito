import { CreateBannedParticipantInput } from "@repo/validation";
import { BannedParticipantModel } from "./banned-participant.model";

const addBannedParticipantRepo = async (data: CreateBannedParticipantInput) => {
  return await BannedParticipantModel.insertOne({ ...data });
};

const getBannedParticipantRepo = async (roomCode: string, userId: string) => {
  return await BannedParticipantModel.findOne({
    room_code: roomCode,
    user_id: userId,
  });
};

export const bannedParticipantRepo = {
  addBannedParticipantRepo,
  getBannedParticipantRepo,
};
