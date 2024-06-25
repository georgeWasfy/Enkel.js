# Enkel.js

A **simple** framework for building backend applications based on Express.js.

## Motivation
*Enkel is built on top of Express.js and is inspired by many frameworks including koa, nest.js, and adonis.js.*
*The main goal was to take pieces that I presonally like from various frameworks and glue them together rather than building stuff from scratch.*

## Hello World Example

```typescript
@Controller("api")
export class HelloController {
  private _helloService: HelloService;
  constructor(@inject("HelloService")private _helloService: HelloService){}

  @Get("/hello")
  public async hello({request,  res, headers, params, body, query}: ctx) {
    return new HttpSuccess(200, {
      message: "Hello from controller",
      data: {}
    });
  }
}
```


## License

[MIT](https://choosealicense.com/licenses/mit/)