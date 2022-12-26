import http from "http";
import express from "express";
import { AppLogger } from "../logger/Logger";
import { AbstractServer } from "./AbstractServer";

export abstract class HttpServer extends AbstractServer {

    private readonly httpServer: http.Server;
    private port: Number;
    public logger: AppLogger

    constructor(express: express.Express, logger: AppLogger) {
        super();

        if (express) {
            this.logger = logger
            this.httpServer = http.createServer(express);
        } else {
            this.httpServer = http.createServer();
        }
    }

    public getPort(): Number {
        return this.port || 3000;
    }

    public setPort(value: Number) {
        this.port = value;
        return this;
    }

    public getHttpServer(): http.Server {
        return this.httpServer;
    }

    public start(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.httpServer)
                return reject(new Error("Failed to create http server."));

            this.httpServer.on('error', (error: any) => {
                this.logger.getLogger().error(error);
                reject(error);
            });

            this.httpServer.on('listening', () => {
                this.logger.getLogger().info('Listening on port %s', this.port);
                resolve(this.httpServer);
            });

            this.httpServer.listen(this.port);
        });
    }
}