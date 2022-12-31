import express, { response, Response } from "express";
import * as _ from "lodash";

import compression from "compression";
import helmet from "helmet";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import "reflect-metadata";

import { AppLogger } from "../logger/logger";
import { HttpServer } from "../baseServer/HttpServer";
import { HttpMethodEnum } from "../common/http/http-method-enum";
import { Result } from "../common/response/http-success";
import { HttpError } from "../common/response/http-error";
import { HttpRoute } from "../common/http/http-route";
import { HttpController } from "../common/http/http-controller";
import { Container } from "inversify";
import { HelloService } from "../../../components/entity/entity.service";
import {
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from "../utils";

const DEFAULT_SESSION_SECRET = "220183";

class Options {
  useCors: boolean;
}

export class ExpressRestServer extends HttpServer {
  private express: express.Express;

  private container = new Container();

  private router: express.Router;

  public logger;

  static globalControllers: HttpController[];

  constructor(options?: Options) {
    let application = express();
    let applicationLogger = new AppLogger();
    super(application, applicationLogger);

    this.container.bind<HelloService>('HelloService').to(HelloService);
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
    return result instanceof Result ? true : false;
  }
  private static isErrorResponse(result: any) {
    return result instanceof HttpError ? true : false;
  }

  private static isexpressResponse(result: any): result is Response {
    return result.statusCode || result.statusMessage;
  }

  // 1:18 singlton approuter
  public static setGlobalControllers(controllers: HttpController[]) {
    this.globalControllers = controllers;
  }

  public getExpressInstance(): express.Express {
    return this.express;
  }

  public async start(): Promise<any> {
    this.registerInjectable();
    await this.initialize();
    return await super.start();
  }

  private registerInjectable() {
    const constructors = getControllersFromMetadata();
    constructors.forEach((constructor) => {
      const { name } = constructor as { name: string };

      if (this.container.isBoundNamed("Controller", name)) {
        throw new Error(`Controller with name ${name} is already defined`);
      }
      this.container
        .bind("Controller")
        .to(constructor as new (...args: Array<never>) => unknown)
        .whenTargetNamed(name);
    });
    const controllers = getControllersFromContainer(this.container, true);
    // controllers.forEach((controller: any) => {
    //   const controllerMetadata = getControllerMetadata(controller.constructor);
    //   console.log(
    //     "🚀 ~ file: express-rest-server.ts:119 ~ ExpressRestServer ~ controllers.forEach ~ controllerMetadata",
    //     controllerMetadata
    //   );
    // });
  }
  private async initialize() {
    for (const controller of ExpressRestServer.globalControllers) {
      this.logger.info("/***** Initializing MY Framework :D *****/");
      this.logger.info("Loading routes.......");
      for (const route of controller.routeHandlers) {
        this.logger.info(route.method + " - " + route.url);
        this.router[route.method](
          `/${controller.urlPrefix}${route.url}`,
          this.createRoute(route, controller)
        );
      }
    }
    this.express.use(this.router);
  }

  private createRoute(route: any, controller: any) {

    return async (req: express.Request, res: express.Response) => {
      const values: any[] = [];
      // let result = route.callback.apply(instance, values);
     let result = route.callback(req, res);

      if (result && typeof result.then === "function") {
        try {
          result = await result;
        } catch (e) {
          this.logger.error("Internal server error.", e);
          result = new Error("Internal server error.");
        }
      }

      if (result && ExpressRestServer.isSuccessResponse(result)) {
        return result.Success(res, this.logger);
      } else if (result && ExpressRestServer.isErrorResponse(result)) {
        return result.Error(res, this.logger);
      } else if (result && ExpressRestServer.isexpressResponse(result)) {
        // needs logging
        return res;
      } else {
        throw new Error("Invalid return type.");
      }
    };
  }

  public bootstrap(fun: Function) {
    if (fun && typeof fun == "function") {
      fun();
    }
  }
}
