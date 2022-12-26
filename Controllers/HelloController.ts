import { Controller, Get, HttpError, Result } from "../src"
import { BadRequest } from "../src/lib/common/response/HttpError"



@Controller("api")
export class HelloController {

    @Get("/test")
    private async test() {
        // return new Result(200, {
        //     message: "Hello world!!"
        // })
        return new BadRequest('This is a bad request', {})
    }
}