export function Header(name: string, value: string): MethodDecorator {
    return (
      target: Function,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<any>,
    ) => {
    //   extendArrayMetadata(HEADERS_METADATA, [{ name, value }], descriptor.value);
      return descriptor;
    };
  }