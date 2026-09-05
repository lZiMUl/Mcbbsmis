import Router from '@koa/router';
import ViewUtils from '../utils/ViewUtils';

const router: Router = new Router({
  prefix: '/'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.body = ViewUtils('index');
});

export default router;
