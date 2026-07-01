import { CreateActivityInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { activityRepo } from "./activity-log.repo";
import { AppError } from "../../utils/AppError";

//create log service
const addLogService = async (data: CreateActivityInput) => {
  const res = await activityRepo.addActivityRepo(data);

  if (!res) {
    throw new AppError(500, "Failed to add the activity");
  }

  return res;
};

//get log by roomId service
const getRoomLogService = async (roomCode: string, reqFilter: cursorFilters) => {
  const filter: cursorFilters = {
    ...reqFilter,
    limit: Number(reqFilter.limit) || 20,
  };

  const res = await activityRepo.getRoomActivityRepo(roomCode, filter);

  if (!res) {
    throw new AppError(500, "Failed to get the activity");
  }

  return res;
};

//get log by userid service
const getUserLogService = async (userId: string, reqFilter: cursorFilters) => {
  const filter: cursorFilters = {
    ...reqFilter,
    limit: Number(reqFilter.limit) || 10,
  };

  const res = await activityRepo.getUserActivityRepo(userId, filter);

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
