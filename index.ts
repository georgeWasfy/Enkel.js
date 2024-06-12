import "reflect-metadata";
import './example/components/entity/entity.controller'
import { ExpressServer } from "@base/lib/restServer";


const server = new ExpressServer();
server.setPort(3000);
// this will be executed before server initialization
server.bootstrap(()=>console.log('bootstrap'))
server.start();