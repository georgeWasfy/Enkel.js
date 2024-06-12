import { AppLogger } from "@base/lib/logger";
import express from "express";

export class HttpSucess {
  private code: number;
  private data?: any;

  constructor(code: number, data?: any) {
    this.code = code;
    this.data = data;
  }
  
  private Success(response: express.Response, logger: AppLogger) {
    logger.setMethod(response.req.method)
    logger.setRoute(response.req.path)
    logger.getLogger().info(JSON.stringify(this.data))
      if (this.data) 
        response.status(this.code).json(this.data)
      else   
        response.status(this.code)

  }  
}
