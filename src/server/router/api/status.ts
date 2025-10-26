import Router from '@koa/router';
import { status } from '../../index';

const router: Router = new Router({
  prefix: '/status'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify({
    status: status ? 'running' : 'stopping'
  });
});

router.get('/web', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/plain';
  ctx.body = 'ok';
});

export default router;
