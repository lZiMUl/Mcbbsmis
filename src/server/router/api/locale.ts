import Router from '@koa/router';
import Config from '../../config';

const router: Router = new Router({
  prefix: '/locale'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  Config.reload();
  ctx.body = JSON.stringify({
    title: Config.LANGUAGE.get('#30000'),
    globalSettings: Config.LANGUAGE.get('#30001'),
    host: Config.LANGUAGE.get('#30002'),
    port: Config.LANGUAGE.get('#30003'),
    language: Config.LANGUAGE.get('#30004'),
    identifier: Config.LANGUAGE.get('#30005'),
    listenToEvents: Config.LANGUAGE.get('#30006'),
    join: Config.LANGUAGE.get('#30007'),
    follow: Config.LANGUAGE.get('#30008'),
    share: Config.LANGUAGE.get('#30009'),
    view: Config.LANGUAGE.get('#30010'),
    online: Config.LANGUAGE.get('#30011'),
    like: Config.LANGUAGE.get('#30012'),
    danmaku: Config.LANGUAGE.get('#30013'),
    gift: Config.LANGUAGE.get('#30014'),
    bilibiliProfile: Config.LANGUAGE.get('#30015'),
    'bili-roomid': Config.LANGUAGE.get('#30016'),
    'bili-userid': Config.LANGUAGE.get('#30017'),
    'bili-username': Config.LANGUAGE.get('#30018'),
    'xbox-username': Config.LANGUAGE.get('#30018'),
    resourcePack: Config.LANGUAGE.get('#30019'),
    'cross-platform': Config.LANGUAGE.get('#30020'),
    geyser: Config.LANGUAGE.get('#30021'),
    floodgate: Config.LANGUAGE.get('#30022'),
    'save-configuration': Config.LANGUAGE.get('#30023')
  });
});

export default router;
