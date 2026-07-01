import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validateMiddleware";
import {
  createBannedParticipantFormSchema,
  createRoomFormSchema,
  updateRoomParticipantSchema,
} from "@repo/validation";
import { handlerFunc } from "../../utils/asyncHandler";
import {
  banRoomParticipantHandler,
  createRoomHandler,
  getRoomHandler,
  getRoomIdHandler,
  getRoomParticipantsHandler,
  joinRoomHandler,
  levaveRoomHandler,
  removeRoomParticipantHandler,
  updateRoomParticipantHandler,
} from "./room.handler";

const router: Router = Router();

//middleware
router.use(requireAuth);

router.post(
  "/",
  validate(createRoomFormSchema),
  handlerFunc(createRoomHandler),
);

router.get("/", handlerFunc(getRoomIdHandler));

router.get("/:roomCode/participants", handlerFunc(getRoomParticipantsHandler));

router.post("/:roomCode/join", handlerFunc(joinRoomHandler));

router.delete(
  "/:roomCode/participant/:id/remove",
  handlerFunc(removeRoomParticipantHandler),
);

router.delete("/:roomCode/leave", handlerFunc(levaveRoomHandler));

router.patch(
  "/:roomId/participant/:id/changerole",
  validate(updateRoomParticipantSchema),
  handlerFunc(updateRoomParticipantHandler),
);

router.post(
  "/:roomId/participant/:id/ban",
  validate(createBannedParticipantFormSchema),
  handlerFunc(banRoomParticipantHandler),
);

router.get("/:roomCode", handlerFunc(getRoomHandler));

export default router;
