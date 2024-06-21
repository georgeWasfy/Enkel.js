import { HttpRoute } from "./httpRoute";

export class HttpController {
  constructor(
    public urlPrefix: string,
    public name: string,
    public routes: HttpRoute[]
  ) {}
  getRoutes() {
    return this.routes;
  }
  setRoutes(routes: HttpRoute[]) {
    this.routes = routes;
  }
}
