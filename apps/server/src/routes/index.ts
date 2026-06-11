import { Router } from "express";

import userRouter from "../modules/auth/user/user.route";
import healthRouter from "./healthHandler";

const router: Router = Router();

router.use("/health", healthRouter);

router.use("/users", userRouter);

export default router;
