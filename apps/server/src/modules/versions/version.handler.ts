import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { CreateVersionCodeFormInput } from "@repo/validation";
import { cursorFilters } from "@repo/shared-types";
import { versionService } from "./version.service";

//fucntion to add new version for the code
export const addVersionHandler = async (req: Request, res: Response) => {
  //take the user id from the req header
  const userId = req.userId;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  const data: CreateVersionCodeFormInput = req.body;

  if (!data) {
    throw new AppError(401, "req data not found");
  }

  const versionRes = await versionService.addVersionService(data, userId);

  res.status(201).json({
    success: true,
    data: versionRes,
  });
};

export const getVersionHandler = async (req: Request, res: Response) => {
  const roomCode = req.params.roomCode as string;
  const filter: cursorFilters = req.query;

  if (!roomCode?.trim()) {
    throw new AppError(400, "Room code is required");
  }

  const versions = await versionService.getVersionService(roomCode, filter);

  res.status(200).json({
    success: true,
    data: versions,
  });
};

export const restoreVersionHandler = async (req: Request, res: Response) => {
  const userId = req.userId;
  const versionId = req.params.versionId as string;

  if (!userId?.trim()) {
    throw new AppError(401, "Unauthorized");
  }

  if (!versionId?.trim()) {
    throw new AppError(400, "Version id is required");
  }

  const version = await versionService.restoreVersionService(versionId, userId);

  res.status(200).json({
    success: true,
    data: version,
  });
};
