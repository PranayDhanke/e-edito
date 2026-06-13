import { Router } from "express";
import { requireAuth } from "../../../middlewares/authMiddleware";
import { handlerFunc } from "../../../utils/asyncHandler";
import { getMeHandler, getUserHandler } from "./user.handler";
import { clerkMiddleware } from "@clerk/express";

const router: Router = Router();

router.use(requireAuth);

//routes for the getme and the get user
router.get("/me", handlerFunc(getMeHandler));
router.get("/:userId", handlerFunc(getUserHandler));

export default router;
