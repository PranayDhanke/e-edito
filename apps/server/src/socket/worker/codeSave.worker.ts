import { logger } from "../../lib/logger";
import { redisRoomService } from "../../services/redis/room.redis";
import { codeService } from "../services/code.service";

//wrting the fucntion to save the code after the certain time
export const startCodeSave = (time: number) =>
  setInterval(async () => {
    //get the all saved room
    for (const roomCode of codeService.getSavingRooms()) {
      try {
        //get the code fro the each room
        const code = codeService.getCode(roomCode);
        const snapshot = codeService.getDocSnapshot(roomCode);

        Promise.all([
          redisRoomService.updateCode(roomCode, code),
          redisRoomService.saveYDoc(roomCode, snapshot),
        ]);
        //add the code to the redis

        codeService.delSavingRoom(roomCode);
      } catch (err) {
        logger.error(`error while saving code in redis , ${err}`);
      }
    }
  }, time);
