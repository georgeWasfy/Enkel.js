import chalk from "chalk";
import { format, transports, createLogger, Logger } from "winston";

export class AppLogger {
  private logger: Logger;
  private route = "";
  private method = "";
  private Format: any;
  private transportArray: any[];

  constructor() {
    this.Format = format.combine(
      format.colorize(),
      format.colorize({
        all: true,
      }),
      format.timestamp(),
      format.align(),
      format.printf(this.formatParams)
    );
    this.transportArray =
      process.env.NODE_ENV === "production"
        ? [new transports.File({ filename: "logs/error.log", level: "error" })]
        : [new transports.Console()];
    const logger = createLogger({
      format: this.Format,
      transports: this.transportArray,
    });

    process.on("uncaughtException", (error: any) => {
      this.getLogger().error(error);
    });
    this.logger = logger;
  }

  setRoute(route: string) {
    this.route = route;
  }
  setMethod(method: string) {
    this.method = method;
  }
  info(message: string, obj?: any) {
    if (obj)
      this.logger.log("info", chalk.cyanBright.bold(message), {
        obj,
      });
    else this.logger.log("info", chalk.cyanBright.bold(message));
  }

  warn(message: string, obj?: any) {
    if (obj) this.logger.log("warn", chalk.yellowBright.bold(message), { obj });
    else this.logger.log("warn", chalk.yellowBright.bold(message));
  }

  error(message: string, obj?: any) {
    if (obj) this.logger.log("error", chalk.redBright.bold(message), { obj });
    else this.logger.log("error", chalk.redBright.bold(message));
  }

  getLogger(): Logger {
    return this.logger;
  }

  // *** helpers ***
  formatParams = (info: any) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");

    return `[${this.method} ${this.route}] ${ts} ${level}:${
      this.route
    } ${message} ${Object.keys(args).length ? JSON.stringify(args) : ""}`;
  };

  dateFormat = () => {
    return new Date(Date.now()).toUTCString();
  };
  // *** ***
}
