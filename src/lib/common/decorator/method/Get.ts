import { getRoutes } from "../../http/BaseRoute";
import { HttpRoute, MiddlewareFunction } from "../../http/HttpRoute";
import { HttpMethod } from "../../http/HttpMethodEnum";


export function Get(route?: string, middlewares?: [MiddlewareFunction]): MethodDecorator {
    return (target: Function, method: string, descriptor: TypedPropertyDescriptor<any>) => {
        let routes = getRoutes(target) as any;
        routes[method] = new HttpRoute(null, method, route, HttpMethod.get, descriptor.value, middlewares);
    };
}