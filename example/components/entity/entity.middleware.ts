import { NextFunction } from "express";
import { ctx } from "@base/lib/restServer/context";

export async function testMiddleware(ctx: ctx, next: NextFunction) {
  ctx.headers = { "header-from-middleware": "hello" };
  await next();
}
