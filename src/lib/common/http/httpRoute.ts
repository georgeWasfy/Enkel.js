import express from "express";
import { HttpMethodEnum } from "./httpMethodEnum";
import { BODY_METADATA, QUERY_METADATA, PARAM_METADATA } from "@base/constants";
export type MiddlewareFunction = express.RequestHandler;
export type HandlerParameterType =
  | typeof BODY_METADATA
  | typeof QUERY_METADATA
  | typeof PARAM_METADATA;
export class HttpRoute {
  constructor(
    public name: string,
    public url: string,
    public method: HttpMethodEnum,
    public params?: {
      type: HandlerParameterType;
      idx: number;
      identifier?: string;
    }[]
  ) {}
}
