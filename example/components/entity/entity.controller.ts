import { Request, Response } from "express";
import { inject } from "inversify";

import { HelloService } from "./entity.service";
import { HttpSuccess } from "@base/lib/common/response";
import { Controller, Get, Header } from "@base/lib/common/decorator";
import { BadRequest } from "@base/lib/common/response/httpError";

@Controller("api")
export class HelloController {
  constructor(@inject("HelloService") public _helloService: HelloService) {}

  @Get("/test")
  @Header("Cache-Control", "none")
  private async test(req: Request, res: Response) {
    const resp = this._helloService.t();
    // return res.json({"fgfgf": "ggff"})
    return new HttpSuccess(200, resp);
    // return new BadRequest('This is a bad request', {})
  }

  @Get("/testtt")
  private async testtt() {
    // return new Result(200, {
    //   message: "Hello world!!",
    // });
    return new BadRequest("This is a bad request", {});
  }
}
