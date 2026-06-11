import { RequestHandler } from "express";

//handler function to handle the app functions to avoid the try catch everywhere
export const handlerFunc = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
