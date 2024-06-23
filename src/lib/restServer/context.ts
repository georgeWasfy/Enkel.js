import { Request, Response } from "express";

export class ctx {
  public req: Request;

  public res: Response;

  // better ways to type
  public body: Object;

  public params: any;

  public query: Object;

  public headers: Object;

  public cookies: Object;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.body = req.body || {};
    this.params = req.params || {};
    this.query = req.query || {};
    this.headers = req.header || {};
    this.cookies = req.cookies || {};
  }

}
