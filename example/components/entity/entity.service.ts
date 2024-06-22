import { Service } from "@base/lib/common/decorator";

@Service()
export class HelloService {
  public test1() {
    return { message: "Hello from service" };
  }
}
