import { redisRoomService } from "../../services/redis/room.redis";
import { codeService } from "../services/code.service";

//wrting the fucntion to save the code after the certain time
export const startCodeSave = (time: number) =>
  setInterval(async () => {
    //get the all saved room
    for (const roomCode of codeService.getSavingRooms()) {
      //get the code fro the each room
      const code = codeService.getCode(roomCode);

      //add the code to the redis
      await redisRoomService.updateCode(roomCode, code);

      codeService.delSavingRoom(roomCode);
    }
  }, time);
