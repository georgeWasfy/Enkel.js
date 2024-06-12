import { Request, Response } from "express";
import { inject } from "inversify";

import { HelloService } from "./entity.service";
import { Controller, Get, Header, Result } from "../../../src";
import { BadRequest } from "../../../src/lib/common/response/http-error";

@Controller("api")
export class HelloController {
  constructor(@inject("HelloService") public _helloService: HelloService) {
  }

  @Get("/test")
  @Header('Cache-Control', 'none')
  private async test(req: Request, res: Response) {

    const resp =  this._helloService.t()
    console.log("🚀 ~ file: entity.controller.ts:13 ~ HelloController ~ test ~ resp", resp)
    // return res.json({"fgfgf": "ggff"})
    return new Result(200, resp);
    // return new BadRequest('This is a bad request', {})
  }

  @Get("/testtt")
  private async testtt() {
    // return new Result(200, {
    //   message: "Hello world!!",
    // });
    return new BadRequest('This is a bad request', {})
  }
}


