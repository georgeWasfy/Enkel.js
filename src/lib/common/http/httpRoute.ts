import express from "express";
import { HttpMethodEnum } from "./httpMethodEnum";

export type MiddlewareFunction = express.RequestHandler;
export class HttpRoute {
  constructor(
    public name: string,
    public url: string,
    public method: HttpMethodEnum,
    public params?: {type: string, idx: number}[]
  ) {}

  public static getBaseUrl(target: Object): string {
    return Reflect.getOwnMetadata("custom:baseUrl", target);
  }

  public static buildUrl(
    target: Object,
    url: string,
    root?: string
  ): string {
    let rootUrl = root ? this.nomalizeUrl(root) : null;
    let baseUrl =
      this.nomalizeUrl(
        rootUrl
          ? rootUrl + "/" + this.getBaseUrl(target)
          : this.getBaseUrl(target)
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
