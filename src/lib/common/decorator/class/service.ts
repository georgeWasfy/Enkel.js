import { injectable } from "inversify";
import { SERVICE_METADATA } from "../../../CONSTANTS";

export function Service(): ClassDecorator {
    return function (target: any) {
        // Reflect.defineMetadata(SERVICE_METADATA, null, target);

      injectable()(target);
    }
  }