import { ExpressRestServer } from "../../../restServer/ExpressRestServer";
import { HttpRoute } from "../../http/HttpRoute";


export function Controller(baseUrl?: string): ClassDecorator {
    return (target: Function) => {
        if (baseUrl) {
            HttpRoute.setBaseUrl(target.prototype, baseUrl);
        }

        ExpressRestServer.prototypeControllers.push(target);
    }
}