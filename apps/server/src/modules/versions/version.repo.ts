import { CreateVersionCodeInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { VersionCodeModel } from "./version.model";
import { QueryFilter, Types } from "mongoose";

//create a repo function to create a version
const addVersionRepo = async (data: CreateVersionCodeInput) => {
  return await VersionCodeModel.insertOne({ ...data });
};

const getVersions = async (roomCode: string, filter: cursorFilters) => {
  const query: QueryFilter<{
    room_code: string;
    _id: Types.ObjectId;
  }> = {
    room_code: roomCode,
  };

  if (filter.cursor) {
    query._id = {
      $lt: new Types.ObjectId(filter.cursor),
    };
  }

  const limit = Number(filter.limit) || 10;
  const versions = await VersionCodeModel.find({ query })
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = versions.length > limit;

  if (hasNextPage) {
    versions.pop();
  }

  return {
    versions,
    nextCursor: hasNextPage ? versions[versions.length - 1]?._id : null,
    pagination: {
      limit,
      hasNextPage,
    },
  };
};

export const versionRepo = {
  addVersionRepo,
  getVersions,
};
