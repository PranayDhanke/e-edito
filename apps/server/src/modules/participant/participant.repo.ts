import { CreateRoomParticipantInput } from "@repo/validation";
import { RoomParticipantModel } from "./participant.model";

//creating a new repo function to add new participant
const addParticipantRoomRepo = async (data: CreateRoomParticipantInput) => {
  return await RoomParticipantModel.insertOne({ ...data });
};

//get joined room for user
const getJoinedRoomsRepo = async (userId: string) => {
  return await RoomParticipantModel.find({ user_id: userId });
};

//get room participant repo
const getRoomParticipantsRepo = async (roomCode: string) => {
  const participants = await RoomParticipantModel.find({
    room_code: roomCode,
  }).populate("user_id", "name profile_image");
  return participants;
};

const getRoomParticipantByUserRepo = async (
  roomCode: string,
  userId: string,
) => {
  return await RoomParticipantModel.findOne({
    room_code: roomCode,
    user_id: userId,
  });
};

//delete room participant repo
const deleteRoomParticipantRepo = async (userId: string, roomCode: string) => {
  return await RoomParticipantModel.deleteOne({
    user_id: userId,
    room_code: roomCode,
  });
};

//change participant role repo
const changeParticipantRoleRepo = async (
  userId: string,
  roomCode: string,
  role: string,
) => {
  return await RoomParticipantModel.updateOne(
    { user_id: userId, room_code: roomCode },
    { role: role },
  );
};

export const participantRepo = {
  addParticipantRoomRepo,
  getRoomParticipantsRepo,
  getRoomParticipantByUserRepo,
  deleteRoomParticipantRepo,
  changeParticipantRoleRepo,
  getJoinedRoomsRepo,
};
