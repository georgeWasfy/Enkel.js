import { decorate, injectable } from "inversify";
import { ExpressServer } from "@base/lib/restServer";
import {
  CONTROLLER_METADATA,
  PATH_METADATA,
  HTTP_METHOD_METADATA,
} from "@base/lib/constants";
import { HttpMethodEnum } from "@base/lib/common/http/httpMethodEnum";
import { HttpController } from "@base/lib/common/http/httpController";
import { HttpRoute } from "@base/lib/common/http/httpRoute";

export function Controller(baseUrl: string): ClassDecorator {
  return function (target: Function) {
    const currentMetadata: any = {
      middlewares: [],
      baseUrl,
      target,
    };
    decorate(injectable(), target);
    Reflect.defineMetadata(CONTROLLER_METADATA, currentMetadata, target);
    const previousMetadata: Array<any> =
      (Reflect.getMetadata(CONTROLLER_METADATA, Reflect) as Array<any>) || [];
    const newMetadata = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(CONTROLLER_METADATA, newMetadata, Reflect);
    let routes = [];
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(PATH_METADATA, target.prototype, key);
      const httpMethod: HttpMethodEnum = Reflect.getMetadata(
        HTTP_METHOD_METADATA,
        target.prototype,
        key
      );
      const httpRoute = new HttpRoute(
        null,
        key,
        path,
        HttpMethodEnum[httpMethod],
        routeHandler,
        []
      );
      routes.push(httpRoute);
    }
    const controller = new HttpController(baseUrl, target.name, routes);
    ExpressServer.setGlobalControllers([controller]);
  };
}
