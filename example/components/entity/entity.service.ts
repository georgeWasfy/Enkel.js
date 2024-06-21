import { Service } from "@base/lib/common/decorator";

@Service()
export class HelloService {
    public  t() {
        return  {message: 'from service'}
      }
}