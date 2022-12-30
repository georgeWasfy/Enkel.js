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

const DEFAULT_SESSION_SECRET = "220183";

class Options {
  useCors: boolean;
}

export class ExpressRestServer extends HttpServer {
  public static readonly prototypeControllers: any[] = [];

  private readonly controllers: any[];

  private express: express.Express;

  private router: express.Router;

  public logger;

  private root: string | undefined;
  static globalControllers: HttpController[];

  constructor(options?: Options) {
    let application = express();
    let applicationLogger = new AppLogger();
    super(application, applicationLogger);

    this.root = undefined;
    this.controllers = [];
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

  public getControllers() {
    return this.controllers;
  }
// 1:18 singlton approuter
  public static setGlobalControllers(controllers: HttpController[]) {
    this.globalControllers = controllers;
  }

  public getExpressInstance(): express.Express {
    return this.express;
  }

  public getRoot(): string | undefined {
    return this.root;
  }

  public setRoot(value: string) {
    this.root = value;
    return this;
  }

  public async start(): Promise<any> {
    await this.initialize();
    return await super.start();
  }


  private async initialize() {
    for (const controller of ExpressRestServer.globalControllers) {
      this.logger.info("/***** Initializing MY Framework :D *****/");
      this.logger.info("Loading routes.......");
      for (const route of controller.routeHandlers) {
        this.logger.info(route.method + " - " + route.url);
        this.router[route.method](`/${controller.urlPrefix}${route.url}`,this.createRoute(route))
      }
    }
    this.express.use(this.router);
  }

  private createRoute(route: any) {
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
