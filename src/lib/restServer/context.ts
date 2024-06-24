import { Request, Response } from "express";
import { IEnkelRequest } from "./types";
import { EnkelRequest } from "./request";

export class ctx {
  public request: IEnkelRequest;

  public res: Response;

  // better ways to type
  public body: Object;

  public params: any;

  public query: Object;

  public headers: Object;

  public cookies: Object;

  constructor(req: Request, res: Response) {
    this.request = new EnkelRequest(req);
    this.res = res;
    this.body = req.body || {};
    this.params = req.params || {};
    this.query = req.query || {};
    this.headers = req.header || {};
    this.cookies = req.cookies || {};
  }

}
