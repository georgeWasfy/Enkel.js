import "reflect-metadata";
import './example/components/entity/entity.controller'

import { ExpressRestServer } from './src';

const server = new ExpressRestServer();
server.setPort(3000);
// this will be executed before server initialization
server.bootstrap(()=>console.log('bootstrap'))
server.start();