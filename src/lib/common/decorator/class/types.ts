import { HttpController } from "../../http";

export interface ModuleMetadata {
    /**
     * Optional list of modules that have the providers which are
     * required in this module.
     */
    imports?: any[];
    /**
     * Optional list of controllers defined in this module which have to be
     * instantiated.
     */
    controllers?: any[];
}