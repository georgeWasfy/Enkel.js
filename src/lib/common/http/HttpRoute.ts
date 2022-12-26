import express from 'express'
import { BaseRoute } from './BaseRoute';
import { HttpMethod } from "./Methods";

export type MiddlewareFunction = express.RequestHandler;

export class HttpRoute implements BaseRoute {
    constructor(public id: any,
                public name: string,
                public url: any,
                public method: HttpMethod,
                public callback: Function,
                public middlewares?: [MiddlewareFunction]) {
    }
}