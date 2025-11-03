import Router from '@koa/router';
import LanguageEnum from '../../enum/LanguageEnum';

const router: Router = new Router({
  prefix: '/language'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify([
    {
      code: LanguageEnum.EN_US,
      name: 'English'
    },
    {
      code: LanguageEnum.RU_RU,
      name: 'русский язык'
    },
    {
      code: LanguageEnum.ZH_CN,
      name: '简体中文'
    },
    {
      code: LanguageEnum.ZH_TW,
      name: '繁體中文'
    },
    {
      code: LanguageEnum.JA_JP,
      name: '日本語'
    },
    {
      code: LanguageEnum.FR_FR,
      name: 'Français'
    },
    {
      code: LanguageEnum.DE_DE,
      name: 'Deutsch'
    }
  ]);
});

export default router;
