import { BODY_METADATA, PARAMETER_METADATA } from "@base/constants";

export function Body(): ParameterDecorator {
  return (target: Object, key: string, parameterIndex: number) => {
    const prevMetadata =
      Reflect.getMetadata(PARAMETER_METADATA, target, key) || [];
    const currentMetadata = { type: BODY_METADATA, idx: parameterIndex };
    Reflect.defineMetadata(
      PARAMETER_METADATA,
      [currentMetadata, ...prevMetadata],
      target,
      key
    );
  };
}
