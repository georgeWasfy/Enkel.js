import { format, transports, createLogger, Logger } from "winston";

const { combine, timestamp, label, prettyPrint } = format;
export class AppLogger {
  private logger: Logger;
  private route: string;
  private logDataObj: any;

  constructor() {
    const logger = createLogger({
      transports: [
        new transports.Console(),
        new transports.File({
          filename: `./logs/server.log`,
        }),
      ],
      format: format.printf((info) => {
        let message = `${this.dateFormat()} | ${info.level.toUpperCase()} | ${
          this.route
        }.log | ${info.message} | `;
        message = info.obj
          ? message + `data:${JSON.stringify(info.obj)} | `
          : message;
        message = this.logDataObj
          ? message + `log_data:${JSON.stringify(this.logDataObj)} | `
          : message;
        return message;
      }),
    });
    process.on("uncaughtException", (error: any) => {
      this.getLogger().error(error);
    });
    this.logger = logger;
  }
  dateFormat = () => {
    return new Date(Date.now()).toUTCString();
  };
  setLogData(logDataObj: any) {
    this.logDataObj = logDataObj;
  }
  info(message: string, obj?: any) {
    if (obj) this.logger.log("info", message, { obj });
    else this.logger.log("info", message);
  }

  debug(message: string, obj?: any) {
    if (obj) this.logger.log("debug", message, { obj });
    else this.logger.log("debug", message);
  }

  error(message: string, obj?: any) {
    if (obj) this.logger.log("error", message, { obj });
    else this.logger.log("error", message);
  }

  getLogger(): Logger {
    return this.logger;
  }
}
