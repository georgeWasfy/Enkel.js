import express from "express";
import { HttpMethodEnum } from "./http-method-enum";

export type MiddlewareFunction = express.RequestHandler;
export interface BaseRoute {
  id: string;
  name: string;
  url: string;
  method: HttpMethodEnum;
  callback: Function;
}
export class HttpRoute {
  constructor(
    public id: any,
    public name: string,
    public url: any,
    public method: HttpMethodEnum,
    public callback: Function,
    public middlewares?: MiddlewareFunction [] ,
    public responseHeaders?: object [] 

  ) {}


  public static getBaseUrl(target: Object): string {
    return Reflect.getOwnMetadata("custom:baseUrl", target);
  }

  public static buildUrl(
    target: Object,
    method: string,
    url: string,
    root?: string
  ): string {

    let rootUrl = root ? this.nomalizeUrl(root) : null;
    let baseUrl =
      this.nomalizeUrl(
        rootUrl ? rootUrl + "/" + this.getBaseUrl(target) : this.getBaseUrl(target)
      ) || "/";
    let returnUrl =
      baseUrl.length === 1 && url
        ? this.nomalizeUrl(url)
        : baseUrl + this.nomalizeUrl(url);

    return returnUrl;
  }

  private static nomalizeUrl(url: string): string {
    if (url) return url.startsWith("/") ? url : "/" + url;

    return "";
  }
}
