import { MIDDLEWARE_METADATA } from "@base/constants";

export function Middleware(fns: Function[]): MethodDecorator {
  return (
    target: Function,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(MIDDLEWARE_METADATA, fns, target, key);
  };
}
