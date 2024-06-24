import { Request } from "express";
import { IEnkelRequest, MediaType, ParamsDictionary, ReqQuery } from "./types";

export class EnkelRequest implements IEnkelRequest {
  accepted: MediaType[];
  protocol: string;
  secure: boolean;
  ip: string;
  ips: string[];
  path: string;
  hostname: string;
  stale: boolean;
  body: any;
  cookies: any;
  method: string;
  params: ParamsDictionary;
  query: ReqQuery;
  route: any;
  signedCookies: any;
  originalUrl: string;
  url: string;
  baseUrl: string;
  constructor(private req: Request) {
    this.accepted = req.accepted;
    this.protocol = req.protocol;
    this.secure = req.secure;
    this.ip = req.ip;
    this.ips = req.ips;
    this.path = req.path;
    this.hostname = req.hostname;
    this.stale = req.stale;
    this.body = req.body;
    this.cookies = req.cookies;
    this.method = req.method;
    this.params = req.params;
    this.query = req.query;
    this.route = req.route;
    this.signedCookies = req.signedCookies;
    this.originalUrl = req.originalUrl;
    this.url = req.url;
    this.baseUrl = req.baseUrl;
  }

  get(name: string): string | undefined {
    return this.req.get(name);
  }
  header(name: string): string | undefined {
    return this.req.header(name);
  }
  accepts(...type: string[]): string | false {
    return this.req.accepts(...type);
  }
  acceptsCharsets(...charset: string[]): string | false {
    return this.req.acceptsCharsets(...charset);
  }
  acceptsEncodings(...encoding: string[]): string | false {
    return this.req.acceptsEncodings(...encoding);
  }
  public toJSON() {
    return {
      accepted: this.accepted,
      protocol: this.protocol,
      secure: this.secure,
      ip: this.ip,
      ips: this.ips,
      path: this.path,
      hostname: this.hostname,
      stale: this.stale,
      body: this.body,
      cookies: this.cookies,
      method: this.method,
      params: this.params,
      query: this.query,
      route: this.route,
      signedCookies: this.signedCookies,
      originalUrl: this.originalUrl,
      url: this.url,
      baseUrl: this.baseUrl,
    };
  }
}
