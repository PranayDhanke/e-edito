import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { ZodError, ZodSchema } from "zod";

//creating a middleware for the validatio purpose
export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await req.body;
      console.log(body);

      schema.parse(body);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new AppError(400, `validation error ${err} `);
      }

      next(err);
    }
  };
