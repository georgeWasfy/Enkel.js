import { ExpressRestServer } from "../../../restServer/express-rest-server";
import { HttpRoute } from "../../http/http-route";


export function Controller(baseUrl?: string): ClassDecorator {
    return (target: Function) => {
        if (baseUrl) {
            HttpRoute.setBaseUrl(target.prototype, baseUrl);
        }

        ExpressRestServer.prototypeControllers.push(target);
    }
}