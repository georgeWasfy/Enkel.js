import { SERVICE_METADATA } from "@base/constants";
import { injectable } from "inversify";

export function Service(): ClassDecorator {
    return function (target: any) {
        Reflect.defineMetadata(SERVICE_METADATA, null, target);

      injectable()(target);
    }
  }