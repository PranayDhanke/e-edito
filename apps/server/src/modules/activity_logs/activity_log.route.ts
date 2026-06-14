import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { handlerFunc } from "../../utils/asyncHandler";
import { getRoomLogHandler, getUserLogHandler } from "./activity_log.handler";

const router: Router = Router();

router.use(requireAuth);

router.get("/", handlerFunc(getUserLogHandler));
router.get("/:roomCode", handlerFunc(getRoomLogHandler));

export default router;
