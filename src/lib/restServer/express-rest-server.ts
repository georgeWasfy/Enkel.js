import express from "express";
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
import { HttpMethod } from "../common/http/http-method-enum";
import { Result } from "../common/response/response";
import { HttpError } from "../common/response/http-error";
import { HttpRoute } from "../common/http/http-route";

const DEFAULT_SESSION_SECRET = "220183";

class Options {
  useCors: boolean;
}

export class ExpressRestServer extends HttpServer {
  public static readonly prototypeControllers: any[] = [];

  private readonly controllers: any[];

  private express: express.Express;

  private router: any;

  public logger;

  private root: string | undefined;

  constructor(options?: Options) {
    let application = express();
    let applicationLogger = new AppLogger();
    super(application, applicationLogger);

    this.root = undefined;
    this.controllers = [];
    this.logger = applicationLogger;
    this.express = application;
    this.router = express.Router();
    /* default routes */
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

  private static successResponse(result: any) {
    return result instanceof Result ? true : false;
  }
  private static errorResponse(result: any) {
    return result instanceof HttpError ? true : false;
  }

  public getControllers() {
    return this.controllers;
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

  private resolveTarget(instance: any, target: any) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        if (Reflect.hasMetadata("custom:inject", target, key)) {
          let propertyConstructor = Reflect.getMetadata(
            "design:type",
            target,
            key
          );
          if (
            Reflect.hasMetadata("custom:service", propertyConstructor.prototype)
          ) {
            instance[key] = new propertyConstructor();
            this.resolveTarget(instance[key], propertyConstructor.prototype);
          }
        }
      }
    }
  }

  private async initialize() {
    let controllers = ExpressRestServer.prototypeControllers;
    for (const controller of controllers) {
      let target = controller.prototype;
      let routes = Reflect.getOwnMetadata("custom:routes", target);
      let parameters = Reflect.getOwnMetadata("custom:parameters", target);

      let instance = new controller();

      this.controllers.push(instance);

      this.resolveTarget(instance, target);
      this.logger.info("/***** Initializing MY Framework :D *****/");
      this.logger.info("Loading routes.......");

      _.keys(routes)
        .map((key) => routes[key])
        .forEach((route) => {
          // route is object from class HttpRoute
          let url = HttpRoute.buildUrl(target, route.name, route.url, this.root);
          this.logger.info(HttpMethod[route.method] + " - " + url);

          // if (route.middlewares)
          //     router[HttpMethod[route.method]](url, route.middlewares, this.createRoute(route, instance, parameters));
          // else
          this.router[HttpMethod[route.method]](
            url,
            this.createRoute(route, instance, parameters)
          );
        });
    }

    this.express.use(this.router);
  }

  private createRoute(route: any, instance: any, parameters: any) {
    return async (req: express.Request, res: express.Response) => {
      const values: any[] = [];
      let result = route.callback.apply(instance, values);
      if (result && typeof result.then === "function") {
        try {
          result = await result;
        } catch (e) {
          this.logger.error("Internal server error.", e);
          result = new Error("Internal server error.");
        }
      }

      if (result && ExpressRestServer.successResponse(result) ) {
        return result.Success(res, this.logger);
      } else if (result && ExpressRestServer.errorResponse(result) ) {
        return result.Error(res, this.logger)
      }else {
        throw new Error("Invalid return type.");
      }
    };
  }

  public bootstrap(fun: Function) {
    if (fun && (typeof fun == "function")) {
      fun();   
   }
  }
}
