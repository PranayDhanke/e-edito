import { Router } from "express";

import userRouter from "../modules/auth/user/user.route";
import healthRouter from "./healthHandler";
import roomRouter from "../modules/room/room.route";
import logsRouter from "../modules/activity_logs/activity_log.route";
import messageRouter from "../modules/messages/message.route";
import versionRouter from "../modules/versions/version.route";

const router: Router = Router();

router.use("/health", healthRouter);

router.use("/users", userRouter);

router.use("/rooms", roomRouter);

router.use("/logs", logsRouter);

router.use("/messages", messageRouter);

router.use("/versions", versionRouter);

export default router;
