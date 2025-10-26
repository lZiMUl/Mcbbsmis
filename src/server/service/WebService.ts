import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import KoaStatic from 'koa-static';

import mountRouters from '../router/mountRouters';

const webService: Koa = new Koa();

webService.use(KoaStatic('./public'));
webService.use(bodyParser());

mountRouters(webService);

export default webService;
