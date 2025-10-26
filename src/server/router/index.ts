import Router from '@koa/router';
import ViewUnit from '../unit/ViewUnit';

const router: Router = new Router({
  prefix: '/'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.body = ViewUnit('index');
});

export default router;
