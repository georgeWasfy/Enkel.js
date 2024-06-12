import { injectable } from "inversify";

@injectable()
export class HelloService {
    public  t() {
        return  {message: 'from service'}
        // return new BadRequest('This is a bad request', {})
      }
}