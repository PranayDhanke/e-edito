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

//room service to handle the user join
const roomConnectionService = async (
  io: Server,
  socket: Socket,
  userId: string,
  data: JoinSocketRoomInput,
) => {
  //get the room
  const room = await redisRoomService.getOrCreateRoom(data.room_code);

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
  await redisRoomService.addParticipant(data.room_code, userId, data.role);

  //join the socket into the room
  await socket.join(data.room_code);

  socket.data.roomCode = data.room_code;
  socket.data.role = data.role;

  //update the last activity
  await redisRoomService.updateActivityTime(data.room_code);

  //get the doc
  const doc = codeService.getOrCreateCodeDoc(data.room_code);

  //get the text
  const text = doc.getText("editor");

  //if code is empty add the code from the redis
  if (text.length === 0) {
    text.insert(0, room.code);
  }

  //create an update for the
  const update = codeService.createUpdate(data.room_code);

  //emit the inital code
  socket.emit(SocketEvent.INITIAL_CODE, update);

  const participants = await getRoomParticipants(data.room_code);
  //emit the room join for the user
  socket.emit(SocketEvent.ROOM_JOINED, participants);

  //broadcast to ther users
  socket.to(data.room_code).emit(SocketEvent.USER_JOINED, {
    role: data.role,
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

  const remainingParticipants = redisRoomService.getParticipants(roomCode);

  //save the code when room is empty and free the memory
  if (Object.keys(remainingParticipants).length === 0) {
    const code = codeService.getCode(roomCode);
    await redisRoomService.updateCode(roomCode, code);
    codeService.deleteDoc(roomCode);
  }

  socket.data.roomCode = undefined;
  socket.data.role = undefined;
};

export const roomService = {
  roomConnectionService,
  roomDisconnectionService,
};
