import { Validation_METADATA } from "@base/constants";
import { validate } from "@base/lib/restServer/types";

export function Validate(schema: validate): MethodDecorator {
  return (
    target: Function,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(Validation_METADATA, schema, target, key);
  };
}
