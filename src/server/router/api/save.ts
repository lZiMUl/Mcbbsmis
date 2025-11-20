import Router from '@koa/router';

import { writeFileSync } from 'node:fs';
import Config from '../../config';
import BaseUnit from '../../unit/BaseUnit';
import IConfigurationTemplate from '../../interface/IConfigurationTemplate';

const router: Router = new Router({
  prefix: '/save'
});

type BooleansToString<T> = {
  [K in keyof T]: T[K] extends boolean ? string : T[K];
};

function normalizeConfig(
  body: BooleansToString<IConfigurationTemplate>
): IConfigurationTemplate {
  return {
    host: body.host || '0.0.0.0',
    port: Number(body.port) || 5700,
    language: body.language || 'en_US',
    identifier: body.identifier || '$',
    join: body.join === 'on' || false,
    follow: body.follow === 'on' || false,
    share: body.share === 'on' || false,
    view: body.view === 'on' || false,
    online: body.online === 'on' || false,
    like: body.like === 'on' || false,
    danmaku: body.danmaku === 'on' || false,
    gift: body.gift === 'on' || false,
    roomid: Number(body.roomid) || 9329583,
    userid: Number(body.userid) || 291883246,
    username_bili: body.username_bili || 'lZiMUl',
    username_xbox: body.username_xbox || 'lZiMUl'
  };
}

router.post('/', async (ctx): Promise<void> => {
  ctx.status = 200;
  ctx.type = 'text/html';

  const CONFIG_CONTENT: string = BaseUnit.ConfigurationTemplate(
    normalizeConfig(
      ctx.request.body as BooleansToString<IConfigurationTemplate>
    )
  );

  writeFileSync(Config.CONFIG_FILE_PATH, CONFIG_CONTENT, { encoding: 'utf-8' });
  ctx.body = '<script>window.location.replace(window.location.origin)</script>';
  setTimeout((): never => process.exit(0), 2 * 1000);
});

export default router;
