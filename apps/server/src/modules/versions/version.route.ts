import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validateMiddleware";
import { createVersionCodeFormSchema } from "@repo/validation";
import { handlerFunc } from "../../utils/asyncHandler";
import { addVersionHandler, getVersionHandler } from "./version.handler";

const router: Router = Router();

router.use(requireAuth);

router.post(
  "/",
  validate(createVersionCodeFormSchema),
  handlerFunc(addVersionHandler),
);

router.get("/:roomCode", handlerFunc(getVersionHandler));

export default router;
