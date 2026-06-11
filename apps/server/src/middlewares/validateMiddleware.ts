import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod/v3";
import { AppError } from "../utils/AppError";

//creating a middleware for the validatio purpose
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new AppError(400, "validation error");
      }

      next(err);
    }
  };
