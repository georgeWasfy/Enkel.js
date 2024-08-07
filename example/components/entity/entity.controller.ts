import { inject } from "inversify";

import { HelloService } from "./entity.service";
import { HttpSuccess } from "@base/lib/common/response";
import {
  Body,
  Controller,
  Get,
  Header,
  Middleware,
  Param,
  Post,
  Query,
  Validate,
} from "@base/lib/common/decorator";
import { ctx } from "@base/lib/restServer/context";
import { validationSchema } from "./entity.schema";
import { testMiddleware } from "./entity.middleware";

@Controller("api")
export class HelloController {
  private _helloService: HelloService;
  constructor(@inject("HelloService") _helloService: HelloService) {
    this._helloService = _helloService;
  }

  @Get("/test1")
  @Middleware([testMiddleware])
  public async test({ request, headers }: ctx) {
    const resp = this._helloService.test1();
    return new HttpSuccess(200, resp);
  }

  @Get("/test2")
  public async test2({ request }: ctx) {
    return new HttpSuccess(200, {
      message: "Hello from controller",
      data: request,
    });
  }
  @Get("/test3")
  public async test3(@Query() query: any) {
    return new HttpSuccess(200, {
      query,
    });
  }
  @Post("/test4")
  @Validate(validationSchema)
  @Middleware([testMiddleware])
  public async test4(@Body() x: any, @Body() y: any) {
    return new HttpSuccess(200, {
      x,
      y,
    });
  }
  @Get("/test5/:id/test/:id2")
  public async test5(@Param("id") id: any, @Param("id2") id2: any) {
    return new HttpSuccess(200, {
      id,
      id2,
    });
  }
}
