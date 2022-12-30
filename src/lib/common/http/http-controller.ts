import { HttpRoute } from "./http-route";

export class HttpController {
    constructor(
      public urlPrefix: string,
      public routeHandlers: HttpRoute[]
    ) {}
    get routes() {
        return this.routeHandlers;
    }
    set routes(routes) {
        this.routeHandlers = routes;
    }
}