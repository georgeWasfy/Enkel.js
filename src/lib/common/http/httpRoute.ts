import express from "express";
import { HttpMethodEnum } from "./httpMethodEnum";

export type MiddlewareFunction = express.RequestHandler;
export class HttpRoute {
  constructor(
    public name: string,
    public url: string,
    public method: HttpMethodEnum,
    public params?: { type: string; idx: number; identifier?: string }[]
  ) {}
}
