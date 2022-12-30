import { Controller, Get, Header, Result } from "../../src";
import { BadRequest } from "../../src/lib/common/response/http-error";

@Controller("api")
export class HelloController {
  @Get("/test")
  @Header('Cache-Control', 'none')
  private async test() {
    return new Result(200, {
      message: "Hello world!!",
    });
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
