import { Router } from "express";
import { executeCodeSchema } from "@repo/validation";
import { requireAuth } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validateMiddleware";
import { handlerFunc } from "../../utils/asyncHandler";
import { executeCodeHandler } from "./execution.handler";

const router: Router = Router();

router.use(requireAuth);

router.post("/", validate(executeCodeSchema), handlerFunc(executeCodeHandler));

export default router;
