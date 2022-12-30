import { HttpRoute, MiddlewareFunction } from "../../http/http-route";
import { HttpMethod } from "../../http/http-method-enum";


export function Get(route?: string, middlewares?: [MiddlewareFunction]): MethodDecorator {
    return (target: Function, key: string, descriptor: TypedPropertyDescriptor<any>) => {

        let routes = HttpRoute.getRoutes(target) as any;
        routes[key] = new HttpRoute(null, key, route, HttpMethod.get, descriptor.value, middlewares);
    };
}