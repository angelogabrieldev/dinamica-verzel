import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.config";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = new Date().toISOString();
  console.log(`[${now}] Request: ${req.method} ${req.url}`);
  next();
};
