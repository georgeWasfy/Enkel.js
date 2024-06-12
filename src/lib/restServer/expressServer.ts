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
import {
  getControllerMetadata,
  getControllersFromContainer,
  getControllersFromMetadata,
} from "@base/utils";
import { HelloService } from "../../../example/components/entity/entity.service";

const DEFAULT_SESSION_SECRET = "220183";

class Options {
  useCors: boolean;
}

export class ExpressServer extends HttpServer {
  private express: express.Express;

  private container = new Container();

  private router: express.Router;

  public logger;

  static globalControllers: HttpController[];

  constructor(options?: Options) {
    let application = express();
    let applicationLogger = new AppLogger();
    super(application, applicationLogger);

    this.container.bind<HelloService>("HelloService").to(HelloService);
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
    console.log("🚀 ~ ExpressServer ~ registerInjectable ~ constructors:", constructors)
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
    for (const controller of ExpressServer.globalControllers) {
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
      const controllers = getControllersFromContainer(this.container, true);
      // controllers.forEach(controller => {
      //   const controllerMetadata = getControllerMetadata(controller.constructor);

      // });
      // problem was in the this scope of controller so it doent see this.service.test()
      // so what needs to be done is dynamically get the class and the handler and invoke the class handler
      // aka restructure and ditch callbacks defined on httproute class
      const controllerMetadata = getControllerMetadata(
        controllers[0].constructor
      );

      const value = await this.container.getNamed<any>(
        "Controller",
        controllerMetadata.target.name
      );
      // console.log(
      //   "🚀 ~ file: express-rest-server.ts:154 ~ ExpressRestServer ~ return ~ value",
      //   value.test
      // );

      // let result = route.callback(req, res);
      let result = value.test(req, res);

      if (result && typeof result.then === "function") {
        try {
          result = await result;
        } catch (e) {
          this.logger.error("Internal server error.", e);
          result = new Error("Internal server error.");
        }
      }

      if (result && ExpressServer.isSuccessResponse(result)) {
        return result.Success(res, this.logger);
      } else if (result && ExpressServer.isErrorResponse(result)) {
        return result.Error(res, this.logger);
      } else if (result && ExpressServer.isexpressResponse(result)) {
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
