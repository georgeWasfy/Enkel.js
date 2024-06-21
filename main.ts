import "reflect-metadata";
import { ExpressServer } from "@base/lib/restServer";
import { AppModule } from "app.module";

const mainModule = new AppModule()
const server = new ExpressServer();
server.setPort(3000);
// this will be executed before server initialization
server.bootstrap(()=>console.log('bootstrap'))
server.start();