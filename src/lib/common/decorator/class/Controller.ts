import { decorate, injectable } from "inversify";
import { ExpressRestServer } from "../../../restServer/express-rest-server";
import { HttpController } from "../../http/http-controller";
import { HttpMethodEnum } from "../../http/http-method-enum";
import { HttpRoute } from "../../http/http-route";
import { CONTROLLER_METADATA, HTTP_METHOD_METADATA, PATH_METADATA } from "../../../constants";

export function Controller(baseUrl: string): ClassDecorator {
  console.log("🚀 ~ Controller ~ baseUrl:", baseUrl)
  return function (target: Function) {
    const currentMetadata: any = {
      middlewares:[],
      baseUrl,
      target,
    };
    decorate(injectable(), target);
    Reflect.defineMetadata(CONTROLLER_METADATA, currentMetadata, target);
    const previousMetadata: Array<any> = Reflect.getMetadata(
      CONTROLLER_METADATA,
      Reflect,
    ) as Array<any> || [];
    const newMetadata = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(
      CONTROLLER_METADATA,
      newMetadata,
      Reflect,
    );
      let routes = []
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(PATH_METADATA, target.prototype, key);
      const httpMethod: HttpMethodEnum = Reflect.getMetadata(HTTP_METHOD_METADATA, target.prototype, key);
      const httpRoute =  new HttpRoute(null, key, path, HttpMethodEnum[httpMethod], routeHandler, []);
      routes.push(httpRoute)
    }
    const controller = new HttpController(baseUrl,target.name, routes)
    console.log("🚀 ~ controller:", controller)
    ExpressRestServer.setGlobalControllers([controller])
  };
}
