import { Request, Response } from "express";
import { IEnkelRequest, ParamsDictionary, ReqQuery } from "./types";
import { EnkelRequest } from "./request";
import { HttpRoute } from "../common/http";

export class ctx {
  public request: IEnkelRequest;

  public res: Response;

  public body: Object;

  public params: ParamsDictionary;

  public query: ReqQuery;

  public headers: Object;

  public cookies: Object;

  constructor(req: Request, res: Response, private httpRoute: HttpRoute) {
    this.request = new EnkelRequest(req, httpRoute);
    this.res = res;
    this.body = req.body || {};
    this.params = req.params || {};
    this.query = req.query || {};
    this.headers = req.header || {};
    this.cookies = req.cookies || {};
  }
}
