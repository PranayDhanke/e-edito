import { Router } from "express";

const router: Router = Router();

router.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Server healthy",
  });
});

export default router;
