import { Router } from "express";
import { createMessageFormSchema } from "@repo/validation";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validateMiddleware";
import { handlerFunc } from "../../utils/asyncHandler";
import {
  createMessageHandler,
  getRoomMessagesHandler,
} from "./message.handler";

const router: Router = Router();

router.use(requireAuth);

router.get("/:roomId", handlerFunc(getRoomMessagesHandler));

router.post(
  "/:roomId",
  validate(createMessageFormSchema),
  handlerFunc(createMessageHandler),
);

export default router;
