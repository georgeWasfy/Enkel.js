import express from "express";
import { AppLogger } from "../../logger/Logger";

export class Result {
  private code: number;
  private data?: any;

  constructor(code: number, data?: any) {
    this.code = code;
    this.data = data;
  }
  
  private Success(response: express.Response, logger: AppLogger) {
    logger.getLogger().info(JSON.stringify(this.data))
      if (this.data) 
        response.status(this.code).json(this.data)
      else   
        response.status(this.code)

  }  
}
