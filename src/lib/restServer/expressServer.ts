import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import "reflect-metadata";

import { AppLogger } from "@base/lib/logger";
import { Container } from "inversify";

import express, { Response } from "express";
import bodyParser from "body-parser";
import { HttpServer } from "@base/lib/baseServer/httpServer";
import { HttpController } from "@base/lib/common/http/httpController";
import { HttpError, HttpSuccess } from "@base/lib/common/response";
import { getControllersFromMetadata } from "@base/utils";
import { HttpRoute } from "../common/http";
import { Class } from "./types";
import { ctx } from "./context";
import { RouteHandlerFactory } from "./routeHandlerFactory";
import { MiddlewareFunction } from "../common/http/httpRoute";

const DEFAULT_SESSION_SECRET = "220183";

class Options {
  useCors: boolean;
}

export class ExpressServer extends HttpServer {
  private express: express.Express;

  private container = new Container();

  private router: express.Router;

  public logger;

  static globalControllers: HttpController[] = [];
  static globalServices: Class[] = [];

  constructor(options?: Options) {
    let application = express();
    let applicationLogger = new AppLogger();
    super(application, applicationLogger);

    this.logger = applicationLogger;
    this.express = application;
    this.router = express.Router();

    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
    this.express.use(cookieParser());
    this.express.use(
      session({
        secret: process.env.SESSION_SECRET
          ? process.env.SESSION_SECRET
          : DEFAULT_SESSION_SECRET,
        name: "sid.sid",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
      })
    );

    this.express.use(compression({ threshold: 0 }));
    this.express.use(helmet());

    if (options && options.useCors) this.express.use(cors());
  }

  private static isSuccessResponse(result: any) {
    return result instanceof HttpSuccess ? true : false;
  }
  private static isErrorResponse(result: any) {
    return result instanceof HttpError ? true : false;
  }

  private static isexpressResponse(result: any): result is Response {
    return result.statusCode || result.statusMessage;
  }

  public static setGlobalControllers(controllers: HttpController[]) {
    this.globalControllers = this.globalControllers.length
      ? [...this.globalControllers, ...controllers]
      : controllers;
  }

  public static setGlobalErvices(services: Class[]) {
    this.globalServices = this.globalServices.length
      ? [...this.globalServices, ...services]
      : services;
  }

  public getExpressInstance(): express.Express {
    return this.express;
  }

  public async start(): Promise<any> {
    this.registerInjectables();
    await this.registerRoutes();
    return await super.start();
  }

  private registerInjectables() {
    this.registerControllers();
    this.registerServices();
  }
  private registerServices() {
    ExpressServer.globalServices.forEach((service) => {
      this.container.bind(service.name).to(service);
    });
  }
  private registerControllers() {
    const constructors = getControllersFromMetadata();
    constructors.forEach((constructor) => {
      //@ts-ignore
      const name = constructor["name"];
      if (this.container.isBoundNamed("Controller", name)) {
        throw new Error(`Controller with name ${name} is already defined`);
      }
      this.container
        .bind(name)
        .to(constructor as new (...args: Array<never>) => unknown);
    });
  }
  private async registerRoutes() {
    this.logger.info("/***** Initializing Framework :D *****/");
    this.logger.info("Loading routes.......");
    for (const controller of ExpressServer.globalControllers) {
      this.logger.info(`Registering routes in ${controller.name}`);
      for (const route of controller.routes) {
        this.logger.info(
          `Registered Route with method ${route.method} on ${route.url}`
        );
        this.router[route.method](
          `/${controller.urlPrefix}${route.url}`,
          this.createRouteHandler(route, controller.name)
        );
      }
    }
    this.express.use(this.router);
  }
  private createRouteHandler(route: HttpRoute, controllerName: string) {
    return async (req: express.Request, res: express.Response, next: MiddlewareFunction) => {
      const controllerInstance = this.container.get(controllerName) as any;
      const context = new ctx(req, res, route);
      for (const middleware of route.middlewares) {
        await middleware(context, next);
        if (res.headersSent) {
          return;
        }
      }
      const handler = new RouteHandlerFactory(
        context,
        route,
        controllerInstance
      ).getHandler();
      let result = undefined;
      if (handler && typeof handler.then === "function") {
        try {
          result = await handler;
        } catch (e) {
          this.logger.error("Internal server error.", e);
        }
      }

      if (result && ExpressServer.isSuccessResponse(result)) {
        return result.Success(res, this.logger);
      }
      if (result && ExpressServer.isErrorResponse(result)) {
        return result.Error(res, this.logger);
      }
      if (result && ExpressServer.isexpressResponse(result)) {
        // needs logging
        return res;
      }
      throw new Error("Invalid return type.");
    };
  }

  public bootstrap(fun: Function) {
    if (fun && typeof fun == "function") {
      fun();
    }
  }
}
