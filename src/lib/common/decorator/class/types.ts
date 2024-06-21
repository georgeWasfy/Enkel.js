import { Class } from "@base/lib/restServer/types";

export interface ModuleMetadata {
  /**
   * Optional list of modules that have the providers which are
   * required in this module.
   */
  imports?: Class[];
  /**
   * Optional list of controllers defined in this module which have to be
   * instantiated.
   */
  controllers?: Class[];

  /**
   * Optional list of services defined in this module which have to be
   * instantiated.
   */
  services?: Class[];
}
