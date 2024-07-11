import { Request } from "express";
import {
  IEnkelRequest,
  MediaType,
  ParamsDictionary,
  ReqQuery,
  validate,
} from "./types";
import Joi from "joi";
import { HttpRoute } from "../common/http";

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
  validationSchema: validate | undefined;
  constructor(private req: Request, private httpRoute: HttpRoute) {
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
    this.validationSchema = httpRoute.validationSchema;
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
  validateBody(schema?: Joi.Schema) {
    if (schema) {
      return schema.validate(this.body);
    }
    if (this.validationSchema?.body) {
      return this.validationSchema.body.validate(this.body);
    }
    throw new Error("No Validation Schema Provided");
  }

  validateHeaders(schema?: Joi.Schema) {
    if (schema) {
      return schema.validate(this.req.headers);
    }
    if (this.validationSchema?.headers) {
      return this.validationSchema.headers.validate(this.req.headers);
    }
    throw new Error("No Validation Schema Provided");
  }

  validateParams(schema?: Joi.Schema) {
    if (schema) {
      return schema.validate(this.req.params);
    }
    if (this.validationSchema?.params) {
      return this.validationSchema.params.validate(this.req.params);
    }
    throw new Error("No Validation Schema Provided");
  }

  validateQuery(schema?: Joi.Schema) {
    if (schema) {
      return schema.validate(this.req.query);
    }
    if (this.validationSchema?.query) {
      return this.validationSchema.query.validate(this.req.query);
    }
    throw new Error("No Validation Schema Provided");
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
