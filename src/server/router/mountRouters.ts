import Koa from 'koa';
import Router from '@koa/router';

import index from './index';
import config from './api/config';
import languages from './api/language';
import save from './api/save';
import start from './api/start';
import status from './api/status';

const router: Router = new Router({
  prefix: '/api'
});

function mountRouters(
  webService: Koa<Koa.DefaultState, Koa.DefaultContext>
): void {
  router.use(config.routes()).use(config.allowedMethods());
  router.use(languages.routes()).use(languages.allowedMethods());
  router.use(save.routes()).use(save.allowedMethods());
  router.use(start.routes()).use(start.allowedMethods());
  router.use(status.routes()).use(status.allowedMethods());

  webService.use(index.routes()).use(index.allowedMethods());
  webService.use(router.routes()).use(router.allowedMethods());
}

export default mountRouters;
