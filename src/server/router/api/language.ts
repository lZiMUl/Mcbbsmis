import Router from '@koa/router';

const router: Router = new Router({
  prefix: '/language'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify([
    {
      code: 'en_US',
      name: 'English'
    },
    {
      code: 'ru_RU',
      name: 'русский язык'
    },
    {
      code: 'zh_CN',
      name: '简体中文'
    },
    {
      code: 'zh_TW',
      name: '繁體中文'
    }
  ]);
});

export default router;
