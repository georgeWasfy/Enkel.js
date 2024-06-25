import { ctx } from "../restServer/context";
import { NextFunction } from "express";

export async function validationMiddleware(ctx: ctx, next: NextFunction) {
  const result = ctx.request.validateBody();
  if (result.error) {
    ctx.res.json(result.error);
  }
  await next();
}
