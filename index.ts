import './controllers/HelloController'
import { ExpressRestServer } from './src';

const server = new ExpressRestServer();
server.setPort(3000);
server.start();