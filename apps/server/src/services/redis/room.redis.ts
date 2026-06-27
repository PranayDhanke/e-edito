import { redis } from "../../config/redis";
import { Room } from "@repo/validation";
import { roomService } from "../../modules/room/room.service";

const getRoomKey = (roomCode: string) => `room:${roomCode}`;
const getParticipantsKey = (roomCode: string) =>
  `room:${roomCode}:participants`;

type RedisRoom = {
  code: string;
  language: string;
  revision: number;
  last_activity: number;
};

// Store room in Redis
const addRoom = async (
  roomCode: string,
  code: string,
  language: string,
) => {
  const room: RedisRoom = {
    code,
    language,
    revision: 0,
    last_activity: Date.now(),
  };

  await redis.set(getRoomKey(roomCode), JSON.stringify(room));

  return room;
};

// Get room from Redis or Mongo
const getOrCreateRoom = async (roomCode: string) => {
  const cachedRoom = await redis.get(getRoomKey(roomCode));

  if (cachedRoom) {
    return JSON.parse(cachedRoom) as RedisRoom;
  }

  const room = (await roomService.getRoomService(roomCode)) as Room | null;

  if (!room) return null;

  return addRoom(roomCode, room.code, room.language);
};

// Update last activity
const updateActivityTime = async (roomCode: string) => {
  const room = await getOrCreateRoom(roomCode);

  if (!room) return null;

  room.last_activity = Date.now();

  await redis.set(getRoomKey(roomCode), JSON.stringify(room));

  return room;
};

// Update editor code
const updateCode = async (roomCode: string, code: string) => {
  const room = await getOrCreateRoom(roomCode);

  if (!room) return null;

  room.code = code;
  room.revision++;
  room.last_activity = Date.now();

  await redis.set(getRoomKey(roomCode), JSON.stringify(room));

  return room;
};

// Delete room cache
const deleteRoom = async (roomCode: string) => {
  await Promise.all([
    redis.del(getRoomKey(roomCode)),
    redis.del(getParticipantsKey(roomCode)),
  ]);
};

// Add participant
const addParticipant = async (
  roomCode: string,
  userId: string,
  role: string,
) => {
  return redis.hset(getParticipantsKey(roomCode), userId, role);
};

// Remove participant
const removeParticipant = async (roomCode: string, userId: string) => {
  return redis.hdel(getParticipantsKey(roomCode), userId);
};

// Get all participants
const getParticipants = async (roomCode: string) => {
  return redis.hgetall(getParticipantsKey(roomCode));
};

export const redisRoomService = {
  addRoom,
  getOrCreateRoom,
  updateActivityTime,
  updateCode,
  deleteRoom,

  addParticipant,
  removeParticipant,
  getParticipants,
};