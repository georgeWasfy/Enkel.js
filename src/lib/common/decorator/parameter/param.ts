import { PARAM_METADATA, PARAMETER_METADATA } from "@base/constants";

export function Param(paramName: string): ParameterDecorator {
  return (target: Object, key: string, parameterIndex: number) => {
    const prevMetadata =
      Reflect.getMetadata(PARAMETER_METADATA, target, key) || [];
    const currentMetadata = { type: PARAM_METADATA, idx: parameterIndex, identifier: paramName };
    Reflect.defineMetadata(
      PARAMETER_METADATA,
      [currentMetadata, ...prevMetadata],
      target,
      key
    );
  };
}
