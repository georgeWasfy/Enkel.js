import { QUERY_METADATA, PARAMETER_METADATA } from "@base/constants";

export function Query(): ParameterDecorator {
  return (target: Object, key: string, parameterIndex: number) => {
    const prevMetadata =
      Reflect.getMetadata(PARAMETER_METADATA, target, key) || [];
    const currentMetadata = { type: QUERY_METADATA, idx: parameterIndex };
    Reflect.defineMetadata(
      PARAMETER_METADATA,
      [currentMetadata, ...prevMetadata],
      target,
      key
    );
  };
}
