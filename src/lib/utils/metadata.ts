import { DecoratorTarget } from "inversify/lib/annotation/decorator_utils";
import { CONTROLLER_METADATA } from "../CONSTANTS";

export function getControllersFromContainer(
    container: any,
    forceControllers: boolean,
  ): Array<any> {
    if (container.isBound('Controller')) {
      return container.getAll('Controller');
    } if (forceControllers) {
      throw new Error('No Controller Found');
    } else {
      return [];
    }
  }

export function getControllersFromMetadata(): Array<DecoratorTarget> {
    const arrayOfControllerMetadata: Array<any> =
      Reflect.getMetadata(
        CONTROLLER_METADATA,
        Reflect,
      ) as Array<any> || [];
    return arrayOfControllerMetadata.map(metadata => metadata.target);
  }
  
  export function getControllerMetadata(
    constructor: NewableFunction
  ) {
    const controllerMetadata = Reflect.getOwnMetadata(
      CONTROLLER_METADATA,
      constructor,
    );
    return controllerMetadata;
  }