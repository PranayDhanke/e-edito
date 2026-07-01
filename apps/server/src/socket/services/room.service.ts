import { Server, Socket } from "socket.io";
import { redisRoomService } from "../../services/redis/room.redis";
import { redisUserService } from "../../services/redis/user.redis";
import { SocketEvent } from "@repo/shared-types";
import { JoinSocketRoomInput } from "@repo/validation";
import { codeService } from "./code.service";

//function to get the room participants
const getRoomParticipants = async (roomCode: string) => {
  //refis function to get the ids of the users
  const participants = [];
  const ids = await redisRoomService.getParticipants(roomCode);

  for (const [participantUserId, role] of Object.entries(ids)) {
    const user = await redisUserService.getOrCreateUser(participantUserId);

    if (!user) {
      continue;
    }

    participants.push({
      ...user,
      role,
    });
  }

  return participants;
};

const normalizeStoredYDoc = (snapshot: unknown) => {
  if (!snapshot) {
    return null;
  }

  if (snapshot instanceof Uint8Array) {
    return snapshot;
  }

  if (Buffer.isBuffer(snapshot)) {
    return new Uint8Array(snapshot);
  }

  if (
    typeof snapshot === "object" &&
    snapshot !== null &&
    "type" in snapshot &&
    "data" in snapshot &&
    (snapshot as { type?: string }).type === "Buffer" &&
    Array.isArray((snapshot as { data?: unknown }).data)
  ) {
    return Uint8Array.from((snapshot as { data: number[] }).data);
  }

  return null;
};

//room service to handle the user join
const roomConnectionService = async (
  io: Server,
  socket: Socket,
  userId: string,
  data: JoinSocketRoomInput,
) => {
  const { role, room_code } = await data;
  //get the room
  const room = await redisRoomService.getOrCreateRoom(room_code);

  if (!room)
    return socket.emit(SocketEvent.ERROR, {
      code: "ROOM_NOT_FOUND",
      message: "room not found please check the room code",
    });

  //get the user
  const user = await redisUserService.getOrCreateUser(userId);
  if (!user)
    return socket.emit(SocketEvent.ERROR, {
      code: "USER_NOT_FOUND",
      message: "user not found please try again",
    });

  //add the new member
  await redisRoomService.addParticipant(room_code, userId, role);

  //join the socket into the room
  await socket.join(room_code);

  socket.data.roomCode = room_code;
  socket.data.role = role;

  //update the last activity
  await redisRoomService.updateActivityTime(room_code);

  //get the doc
  const doc = codeService.getOrCreateCodeDoc(room_code);

  //get the text
  const text = doc.getText("editor");

  //if code is empty add the code from the redis
  if (text.length === 0) {
    const storedYDoc = normalizeStoredYDoc(room.yDoc ?? room.ydoc);

    if (storedYDoc) {
      codeService.createUpdateWithDoc(doc, storedYDoc);
    } else {
      text.insert(0, room.code);
    }
  }

  //create an update for the
  const update = codeService.createUpdate(room_code);

  //emit the inital code
  socket.emit(SocketEvent.INITIAL_CODE, update);

  const participants = await getRoomParticipants(room_code);
  
  //emit the room join for the user
  socket.emit(SocketEvent.ROOM_JOINED, participants);

  //broadcast to ther users
  io.to(room_code).emit(SocketEvent.USER_JOINED, {
    role: role,
    ...user,
  });

};

const roomDisconnectionService = async (
  io: Server,
  socket: Socket,
  userId: string,
  roomCode: string,
) => {
  await socket.leave(roomCode);
  await redisRoomService.removeParticipant(roomCode, userId);

  const remainingParticipants =
    await redisRoomService.getParticipants(roomCode);

  //save the code when room is empty and free the memory
  if (Object.keys(remainingParticipants).length === 0) {
    const code = codeService.getCode(roomCode);
    await redisRoomService.updateCode(roomCode, code);
    await redisRoomService.saveYDoc(
      roomCode,
      codeService.getDocSnapshot(roomCode),
    );
    codeService.deleteDoc(roomCode);
  }

  socket.data.roomCode = undefined;
  socket.data.role = undefined;
};

const userDisconnectService = async (
  io: Server,
  socket: Socket,
  userId: string,
  roomCode: string,
) => {
  await socket.leave(roomCode);
  await redisRoomService.removeParticipant(roomCode, userId);

  socket.data.roomCode = undefined;
  socket.data.role = undefined;

  socket.to(roomCode).emit(SocketEvent.USER_LEFT_RES, userId);
};

export const roomService = {
  roomConnectionService,
  userDisconnectService,
  roomDisconnectionService,
};
