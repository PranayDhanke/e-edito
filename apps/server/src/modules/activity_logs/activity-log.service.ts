import { CreateActivityInput } from "@repo/validation";
import { activityRepo } from "./activity-log.repo";
import { AppError } from "../../utils/AppError";

//create log service
const addLogService = async (data: CreateActivityInput) => {
  const res = activityRepo.addActivityRepo(data);

  if (!res) {
    throw new AppError(500, "Failed to add the activity");
  }

  return res;
};

//get log by roomId service
const getRoomLogService = async (room_code: string) => {
  const res = activityRepo.getRoomActivityRepo(room_code);

  if (!res) {
    throw new AppError(500, "Failed to get the activity");
  }

  return res;
};

//get log by userid service
const getUserLogService = async (userId: string) => {
  const res = activityRepo.getRoomActivityRepo(userId);

  if (!res) {
    throw new AppError(500, "Failed to get the activity");
  }

  return res;
};

export const LogService = {
  addLogService,
  getRoomLogService,
  getUserLogService,
};
