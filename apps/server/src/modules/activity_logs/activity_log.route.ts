import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware";
import { handlerFunc } from "../../utils/asyncHandler";
import { getRoomLogHandler } from "./activity_log.handler";
import { getUserHandler } from "../auth/user/user.handler";

const router: Router = Router();

router.use(requireAuth);

router.get("/", handlerFunc(getUserHandler));
router.get("/roomCode", handlerFunc(getRoomLogHandler));

export default router;
