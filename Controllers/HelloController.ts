import { Controller, Get, Result } from "../src"



@Controller("api")
export class HelloController {

    @Get("/test")
    private async test() {
        console.log('cony')
        return new Result("content", {
            message: "Hello world!!"
        })
    }
}