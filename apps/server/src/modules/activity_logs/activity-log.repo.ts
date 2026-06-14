import { CreateActivityInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { activitLogModel } from "./activity-log.model";
import { Types } from "mongoose";

//creating a activity log create function
const addActivityRepo = async (data: CreateActivityInput) => {
  return await activitLogModel.insertOne({ ...data });
};

//get activity by room id for room
const getRoomActivityRepo = async (roomCode: string, filter: cursorFilters) => {
  const query: Record<string, unknown> = {
    room_code: roomCode,
  };

  if (filter.cursor) {
    query._id = {
      $lt: new Types.ObjectId(filter.cursor),
    };
  }

  const limit = Number(filter.limit) || 20;
  const logs = await activitLogModel
    .find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = logs.length > limit;

  if (hasNextPage) {
    logs.pop();
  }

  return {
    logs,
    nextCursor: hasNextPage ? logs[logs.length - 1]?._id : null,
    pagination: {
      limit,
      hasNextPage,
    },
  };
};

//get activity by user id for users
const getUserActivityRepo = async (userId: string, filter: cursorFilters) => {
  const query: Record<string, unknown> = {
    user_id: userId,
  };

  if (filter.cursor) {
    query._id = {
      $lt: new Types.ObjectId(filter.cursor),
    };
  }

  const limit = Number(filter.limit) || 20;
  const logs = await activitLogModel
    .find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = logs.length > limit;

  if (hasNextPage) {
    logs.pop();
  }

  return {
    logs,
    nextCursor: hasNextPage ? logs[logs.length - 1]?._id : null,
    pagination: {
      limit,
      hasNextPage,
    },
  };
};

export const activityRepo = {
  addActivityRepo,
  getRoomActivityRepo,
  getUserActivityRepo,
};
