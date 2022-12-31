import { Request, Response } from "express"
import { Controller, Get, Header } from "../../src"
import { BadRequest } from "../../src/lib/common/response/http-error"
import { HelloService } from "./entity.service"

@Controller("api")
export class HelloController {
  constructor(private readonly _helloService: HelloService) {}
  @Get("/test")
  @Header('Cache-Control', 'none')
  private async test(req: Request, res: Response) {
    return await this._helloService.test()
    // return res.json({"fgfgf": "ggff"})
    // return new Result(200, {
    //   message: "Hello world!!",
    // });
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