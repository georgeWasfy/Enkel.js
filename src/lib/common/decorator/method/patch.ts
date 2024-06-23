import { HTTP_METHOD_METADATA, PATH_METADATA } from "@base/constants";
import { HttpMethodEnum } from "@base/lib/common/http/httpMethodEnum";

export function Patch(path: string): MethodDecorator {
  return (
    target: Function,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_METADATA, path, target, key);
    Reflect.defineMetadata(
      HTTP_METHOD_METADATA,
      HttpMethodEnum.patch,
      target,
      key
    );
  };
}
