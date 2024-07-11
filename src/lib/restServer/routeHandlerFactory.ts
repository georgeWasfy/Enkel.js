import { HttpRoute } from "../common/http";
import { HandlerParameterType } from "../common/http/httpRoute";
import { ctx } from "./context";

export class RouteHandlerFactory {
  private ctx: ctx;
  private routeInfo: HttpRoute;
  private controllerInstance: any;
  constructor(ctx: ctx, route: HttpRoute, controllerInstance: any) {
    this.ctx = ctx;
    this.routeInfo = route;
    this.controllerInstance = controllerInstance;
  }
  public getHandler() {
    let params = [] as any;
    if (this.routeInfo.params) {
      this.routeInfo.params.forEach((p) =>
        params.splice(p.idx, 0, this.resolveParam(p.type, p.identifier))
      );
      return this.controllerInstance[this.routeInfo.name](...params);
    }
    return this.controllerInstance[this.routeInfo.name](this.ctx);
  }

  private resolveParam(type: HandlerParameterType, identifier?: string) {
    switch (type) {
      case "body":
        return this.ctx.body;
      case "param":
        if (identifier) {
          return this.ctx.params[identifier];
        }
        throw new Error("Unkown identifier for URL parameter");
      case "query":
        return this.ctx.query;
      default:
        throw new Error("Unkown decorated parameter");
    }
  }

}
