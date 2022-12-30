import { PATH_METADATA } from "../../../CONSTANTS";

export function Get(path: string): MethodDecorator {
    return (target: Function, key: string, descriptor: TypedPropertyDescriptor<any>) => {

        Reflect.defineMetadata(PATH_METADATA, path, target, key);
    };
}