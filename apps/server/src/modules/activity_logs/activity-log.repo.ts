import { CreateActivityInput } from "@repo/validation";
import { activitLogModel } from "./activity-log.model";

//creating a activity log create function
const addActivityRepo = async (data: CreateActivityInput) => {
  return await activitLogModel.insertOne({ ...data });
};

//get activity by room id for room
const getRoomActivityRepo = async (roomCode: string) => {
  return await activitLogModel.findOne({ room_code: roomCode });
};

//get activity by user id for users
const getUserActivityRepo = async (user_id: string) => {
  return await activitLogModel.findOne({ user_id: user_id });
};

export const activityRepo = {
  addActivityRepo,
  getRoomActivityRepo,
  getUserActivityRepo,
};
