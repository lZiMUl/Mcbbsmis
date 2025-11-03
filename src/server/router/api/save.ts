import Router from '@koa/router';

import { writeFileSync } from 'node:fs';
import Config from '../../config';
import BaseUnit from '../../unit/BaseUnit';
import IConfigurationTemplate from '../../interface/IConfigurationTemplate';

const router: Router = new Router({
  prefix: '/save'
});

const options: Array<string> = [
  'join',
  'follow',
  'share',
  'view',
  'online',
  'like',
  'danmaku',
  'gift'
];

router.post('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/html';

  console.info(ctx.request.body);

  const CONFIG_CONTENT: string = BaseUnit.ConfigurationTemplate(
    Object.fromEntries(
      Object.entries(ctx.request.body as IConfigurationTemplate).map(
        ([key, value]: [string, any]): [string, any] =>
          options.includes(key)
            ? [key, value === 'on' ? true : value]
            : [key, value]
      )
    ) as IConfigurationTemplate
  );

  writeFileSync(Config.CONFIG_FILE_PATH, CONFIG_CONTENT, { encoding: 'utf-8' });
  ctx.body = '<script>window.location.replace(window.location.origin)</script>';
  setTimeout((): never => process.exit(0), 2 * 1000);
});

export default router;
