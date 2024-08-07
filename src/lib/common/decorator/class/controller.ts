import { decorate, injectable } from "inversify";
import { ExpressServer } from "@base/lib/restServer";
import { HttpMethodEnum } from "@base/lib/common/http/httpMethodEnum";
import { HttpController } from "@base/lib/common/http/httpController";
import { HttpRoute } from "@base/lib/common/http/httpRoute";
import {
  CONTROLLER_METADATA,
  HTTP_METHOD_METADATA,
  MIDDLEWARE_METADATA,
  PARAMETER_METADATA,
  PATH_METADATA,
  Validation_METADATA,
} from "@base/constants";
import { validationMiddleware } from "@base/lib/middleware/validation-middleware";

export function Controller(baseUrl: string): ClassDecorator {
  return function (target: Function) {
    const currentMetadata: any = {
      middlewares: [],
      baseUrl,
      target,
    };
    decorate(injectable(), target);
    // Reflect.defineMetadata(CONTROLLER_METADATA, currentMetadata, target);
    const previousMetadata: Array<any> =
      (Reflect.getMetadata(CONTROLLER_METADATA, Reflect) as Array<any>) || [];
    const newMetadata = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(CONTROLLER_METADATA, newMetadata, Reflect);
    let routes = [];
    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      if (key !== "constructor") {
        const path = Reflect.getMetadata(PATH_METADATA, target.prototype, key);
        const params = Reflect.getMetadata(
          PARAMETER_METADATA,
          target.prototype,
          key
        );
        const validationSchema = Reflect.getMetadata(
          Validation_METADATA,
          target.prototype,
          key
        );
        const middlewares = Reflect.getMetadata(
          MIDDLEWARE_METADATA,
          target.prototype,
          key
        );
        const httpMethod: HttpMethodEnum = Reflect.getMetadata(
          HTTP_METHOD_METADATA,
          target.prototype,
          key
        );
        let routeMiddlewares = [];
        if (validationSchema) {
          routeMiddlewares.push(validationMiddleware);
        }
        if (middlewares) {
          routeMiddlewares = [...routeMiddlewares, ...middlewares];
        }
        
        const httpRoute = new HttpRoute(
          key,
          path,
          HttpMethodEnum[httpMethod],
          routeMiddlewares,
          params && params.length ? params : undefined,
          validationSchema
        );
        routes.push(httpRoute);
      }
    }
    const controller = new HttpController(baseUrl, target.name, routes);
    ExpressServer.setGlobalControllers([controller]);
  };
}
