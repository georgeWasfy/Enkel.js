import { ExpressRestServer } from "../../../restserver/ExpressRestServer";
import { setBaseUrl } from "../../http/BaseRoute";


export function Controller(baseUrl?: string): ClassDecorator {
    return (target: Function) => {
        if (baseUrl) {
            setBaseUrl(target.prototype, baseUrl);
        }

        ExpressRestServer.prototypeControllers.push(target);
    }
}