import { ExpressServer } from "@base/lib/restServer";
import { ModuleMetadata } from "./types";

export function Module(moduleMetaData: ModuleMetadata): ClassDecorator {
  return function (target: Function) {
    ExpressServer.setGlobalErvices(moduleMetaData.services || [])
  };
}
