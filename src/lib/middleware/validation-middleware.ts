import { ctx } from "../restServer/context";
import { NextFunction } from "express";

export async function validationMiddleware(ctx: ctx, next: NextFunction) {
  const validationSchema = ctx.request.validationSchema;
  if (validationSchema?.body) {
    const bodyValidation = ctx.request.validateBody();
    if (bodyValidation.error) {
      ctx.res.status(ctx.request.validationSchema?.failureCode || 400).send({
        message: "Body Validation Failed",
        details: bodyValidation.error.details,
      });
      return;
    }
  }
  if (validationSchema?.headers) {
    const headersValidation = ctx.request.validateHeaders();
    if (headersValidation.error) {
      ctx.res.status(ctx.request.validationSchema?.failureCode || 400).send({
        message: "Headers Validation Failed",
        details: headersValidation.error.details,
      });
      return;
    }
  }

  if (validationSchema?.params) {
    const paramsValidation = ctx.request.validateParams();
    if (paramsValidation.error) {
      ctx.res.status(ctx.request.validationSchema?.failureCode || 400).send({
        message: "Params Validation Failed",
        details: paramsValidation.error.details,
      });
      return;
    }
  }
  if (validationSchema?.query) {
    const queryValidation = ctx.request.validateQuery();
    if (queryValidation.error) {
      ctx.res.status(ctx.request.validationSchema?.failureCode || 400).send({
        message: "Query Validation Failed",
        details: queryValidation.error.details,
      });
      return;
    }
  }
  
  await next();
}
