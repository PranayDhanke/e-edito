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
  deleteRoomParticipantHandler,
  getRoomHandler,
  getRoomIdHandler,
  getRoomParticipantsHandler,
  joinRoomHandler,
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

router.get("/:roomId/participants", handlerFunc(getRoomParticipantsHandler));

router.post("/:roomCode/join/:roomId", handlerFunc(joinRoomHandler));

router.delete(
  "/:roomId/participoant/:id/remove",
  handlerFunc(deleteRoomParticipantHandler),
);

router.patch(
  "/:roomId/participoant/:id/changerole",
  validate(updateRoomParticipantSchema),
  handlerFunc(updateRoomParticipantHandler),
);

router.post(
  "/:roomId/participoant/:id/ban",
  validate(createBannedParticipantFormSchema),
  handlerFunc(banRoomParticipantHandler),
);

router.get("/:roomCode", handlerFunc(getRoomHandler));

export default router;
