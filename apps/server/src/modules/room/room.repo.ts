import { CreateRoomInput } from "@repo/validation";
import { RoomModel } from "./room.model";
import { FilterRoomDocs, RoomFilters } from "@repo/shared-types";

import { QueryFilter, Types } from "mongoose";

//creating a repo function to create new room
const createRoomRepo = async (data: CreateRoomInput) => {
  return await RoomModel.insertOne({ ...data });
};

//creating a repo function to get the room details
const getRoomRepo = async (roomCode: string) => {
  return await RoomModel.findOne({ room_code: roomCode });
};

//creating a repo function to get the rooms detail for user
const getRoomIdRepo = async (userId: string, filter: RoomFilters) => {
  //creating a query record to find the filter data
  const query: Record<string, unknown> = { owner_id: userId };

  //cursor
  if (filter.cursor) {
    query._id = {
      $lt: new Types.ObjectId(filter.cursor),
    };
  }

  //search filter
  if (filter.search?.trim()) {
    query.name = {
      $regex: filter.search,
      $options: "i",
    };
  }

  //status filter
  if (filter.status) {
    query.status = filter.status;
  }

  //language filter
  if (filter.language) {
    query.language = filter.language;
  }

  //take the page and limit
  const limit = filter.limit || 10;

  //get the data with the pagination
  const rooms = await RoomModel.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  //check if the next page exists
  const hasNextPage = rooms.length > limit;

  if (hasNextPage) {
    rooms.pop();
  }

  //return all
  return {
    rooms,
    nextCursor: hasNextPage ? rooms[rooms.length - 1]._id : null,
  };
};

export const roomRepo = {
  createRoomRepo,
  getRoomRepo,
  getRoomIdRepo,
};
