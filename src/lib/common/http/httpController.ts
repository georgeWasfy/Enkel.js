import { HttpRoute } from "./httpRoute";

export class HttpController {
  constructor(
    public urlPrefix: string,
    public name: string,
    public routeHandlers: HttpRoute[],
    public services?: any[]
  ) {}
  get routes() {
    return this.routeHandlers;
  }
  set routes(routes) {
    this.routeHandlers = routes;
  }
}
