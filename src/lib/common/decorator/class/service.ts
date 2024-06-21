import { decorate, injectable } from "inversify";

export function Service(): ClassDecorator {
    return function (target: any) {
      decorate(injectable(), target);

    }
  }