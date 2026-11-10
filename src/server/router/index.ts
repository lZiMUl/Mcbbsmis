import Router from '@koa/router';
import ViewUtils from '../utils/ViewUtils';
import Koa, { ParameterizedContext } from 'koa';

const router: Router = new Router({
  prefix: '/'
});

router.get(
  '/',
  async (
    ctx: ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>
  ): Promise<void> => {
    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = ViewUtils('index');
  }
);

export default router;
