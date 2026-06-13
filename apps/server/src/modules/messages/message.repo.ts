import { CreateMessageInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { MessageModel } from "./message.model";
import { QueryFilter, Types } from "mongoose";

const addMessageRepo = async (data: CreateMessageInput) => {
  return await MessageModel.insertOne({ ...data });
};

const getRoomMessagesRepo = async (roomCode: string, filter: cursorFilters) => {
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

  const limit = Number(filter.limit) || 20;
  const messages = await MessageModel.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNextPage = messages.length > limit;

  if (hasNextPage) {
    messages.pop();
  }

  return {
    messages,
    nextCursor: hasNextPage ? messages[messages.length - 1]?._id : null,
    pagination: {
      limit,
      hasNextPage,
    },
  };
};

export const messageRepo = {
  addMessageRepo,
  getRoomMessagesRepo,
};
