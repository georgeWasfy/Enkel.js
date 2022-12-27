import { Controller, Get } from "../../src";
import { BadRequest } from "../../src/lib/common/response/http-error";

@Controller("api")
export class HelloController {
  @Get("/test")
  private async test() {
    // return new Result(200, {
    //   message: "Hello world!!",
    // });
    return new BadRequest('This is a bad request', {})
  }
}
