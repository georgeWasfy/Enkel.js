import { PATH_METADATA } from "../../../CONSTANTS";
import { ExpressRestServer } from "../../../restServer/express-rest-server";
import { HttpController } from "../../http/http-controller";
import { HttpMethod } from "../../http/http-method-enum";
import { HttpRoute } from "../../http/http-route";

export function Controller(baseUrl: string): ClassDecorator {
  return function (target: Function) {
      let routes = []
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(PATH_METADATA, target.prototype, key);
      const httpRoute =  new HttpRoute(null, key, path, HttpMethod.get, routeHandler, []);
      routes.push(httpRoute)
    }
    const controller = new HttpController(baseUrl, routes)
    ExpressRestServer.setGlobalControllers([controller])
  };
}
