import Router from '@koa/router';
import ELanguage from '../../enum/ELanguage';

const router: Router = new Router({
  prefix: '/language'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify([
    {
      code: ELanguage.EN_US,
      name: 'English'
    },
    {
      code: ELanguage.RU_RU,
      name: 'русский язык'
    },
    {
      code: ELanguage.ZH_CN,
      name: '简体中文'
    },
    {
      code: ELanguage.ZH_TW,
      name: '繁體中文'
    },
    {
      code: ELanguage.JA_JP,
      name: '日本語'
    },
    {
      code: ELanguage.FR_FR,
      name: 'Français'
    },
    {
      code: ELanguage.DE_DE,
      name: 'Deutsch'
    }
  ]);
});

export default router;
