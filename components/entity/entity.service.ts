import { injectable } from "inversify";
import { Service } from "../../src/lib/common/decorator/class/service";

@injectable()
export class HelloService {
    public  t() {
        return  {message: 'from service'}
        // return new BadRequest('This is a bad request', {})
      }
}