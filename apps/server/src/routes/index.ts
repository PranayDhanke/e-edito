import { Router } from "express";

const router : Router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server healthy",
  });
});

export default router;