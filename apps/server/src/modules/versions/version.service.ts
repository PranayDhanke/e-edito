import {
  CreateVersionCodeFormInput,
  CreateVersionCodeInput,
} from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { AppError } from "../../utils/AppError";
import { LogService } from "../activity_logs/activity-log.service";
import { versionRepo } from "./version.repo";

//creating a function to create a new version
const addVersionService = async (
  reqData: CreateVersionCodeFormInput,
  userId: string,
) => {
  const data: CreateVersionCodeInput = {
    ...reqData,
    saved_by: userId,
  };

  const res = await versionRepo.addVersionRepo(data);

  if (!res) {
    throw new AppError(500, "failed to create the version");
  }

  const logRes = await LogService.addLogService({
    action: "VERSION_CREATED",
    room_code: reqData.room_code,
    user_id: userId,
    metadata: {
      version_id: res._id,
      version_name: reqData.name,
      reason: reqData.reason,
    },
  });

  if (!logRes) {
    throw new AppError(500, "failed to create version log");
  }

  return res;
};

const getVersionService = async (
  roomCode: string,
  reqFilter: cursorFilters,
) => {
  const filter: cursorFilters = {
    ...reqFilter,
    limit: Number(reqFilter.limit) || 10,
  };

  const res = await versionRepo.getVersions(roomCode, filter);

  if (!res) {
    throw new AppError(500, "failed to get versions");
  }

  return res;
};

const restoreVersionService = async (versionId: string, userId: string) => {
  const version = await versionRepo.getVersionById(versionId);

  if (!version) {
    throw new AppError(404, "Version not found");
  }

  const logRes = await LogService.addLogService({
    action: "VERSION_RESTORED",
    room_code: version.room_code,
    user_id: userId,
    metadata: {
      version_id: version._id,
      version_name: version.name,
    },
  });

  if (!logRes) {
    throw new AppError(500, "failed to create version restore log");
  }

  return version;
};

export const versionService = {
  addVersionService,
  getVersionService,
  restoreVersionService,
};
