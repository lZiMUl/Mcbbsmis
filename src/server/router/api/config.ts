import Router from '@koa/router';
import Config from '../../config';

const router: Router = new Router({
  prefix: '/config'
});

router.get('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'application/json';
  ctx.body = JSON.stringify({
    host: Config.get('global', 'host'),
    port: Config.get('global', 'port'),
    language: Config.get('global', 'language'),
    identifier: Config.get('global', 'identifier'),
    options: {
      join: Config.get('options', 'join'),
      follow: Config.get('options', 'follow'),
      share: Config.get('options', 'share'),
      view: Config.get('options', 'view'),
      online: Config.get('options', 'online'),
      like: Config.get('options', 'like'),
      danmaku: Config.get('options', 'danmaku'),
      gift: Config.get('options', 'gift'),
      resourcePack: Config.get('xbox', 'resourcePack'),
      geyser: Config.get('crossPlatform', 'geyser'),
      floodgate: Config.get('crossPlatform', 'floodgate')
    },
    bilibili: {
      roomid: Config.get('bilibili', 'roomid'),
      userid: Config.get('bilibili', 'userid'),
      username: Config.get('bilibili', 'username')
    },
    xbox: {
      username: Config.get('xbox', 'username')
    },
    crossPlatform: {
      geyser: Config.get('crossPlatform', 'geyser'),
      floodgate: Config.get('crossPlatform', 'floodgate')
    }
  });
});

export default router;
