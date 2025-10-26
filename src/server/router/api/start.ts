import Router from '@koa/router';
import App from '../../index';
import { status } from '../../index';

const router: Router = new Router({
  prefix: '/start'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.body = '<script>window.location.reload()</script>';
  if (!status) App();
});

export default router;
