import { Router } from "express";
import { requireAuth } from "../../../middlewares/authMiddleware";
import { handlerFunc } from "../../../utils/asyncHandler";
import { getMeHandler, getUserHandler } from "./user.handler";

const router: Router = Router();

router.get("/me", requireAuth, handlerFunc(getMeHandler));
router.get("/:userId", handlerFunc(getUserHandler));

export default router;
