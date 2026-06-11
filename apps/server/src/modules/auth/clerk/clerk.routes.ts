import { Router } from "express";
import express from "express";
import { clerkUserHandler } from "./clerk.handler";
import { handlerFunc } from "../../../utils/asyncHandler";

const router: Router = Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  handlerFunc(clerkUserHandler),
);

export default router;
