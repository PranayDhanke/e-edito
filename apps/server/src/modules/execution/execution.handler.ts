import { Request, Response } from "express";
import { ExecuteCodeInput } from "@repo/validation";
import { executionService } from "./execution.service";

export const executeCodeHandler = async (req: Request, res: Response) => {
  const data: ExecuteCodeInput = req.body;
  const result = await executionService.executeCodeService(data);

  res.status(200).json({
    success: true,
    data: result,
  });
};
