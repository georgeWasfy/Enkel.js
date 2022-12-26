import { format, transports, createLogger,Logger } from "winston";

const { combine, timestamp, label, prettyPrint } = format;
export  class AppLogger {

    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            format: combine(
              label({ label: 'right meow!' }),
              timestamp(),
              prettyPrint()
            ),
            transports: [new transports.Console()]
          })

        process.on('uncaughtException', (error: any) => {
            this.getLogger().error(error);
        });
    }

    getLogger(): Logger {
        return this.logger;
    }

}