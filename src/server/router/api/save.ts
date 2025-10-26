import Router from '@koa/router';

import { writeFileSync } from 'node:fs';
import Config from '../../config';

const router: Router = new Router({
  prefix: '/save'
});

function parseToggle(data: string | number | undefined): boolean {
  return data === 'on';
}

router.post('/', async ctx => {
  ctx.status = 200;
  ctx.type = 'text/html';
  const {
    host,
    port,
    language,
    identifier,
    join,
    follow,
    share,
    view,
    online,
    like,
    danmaku,
    gift,
    roomid,
    userid,
    username_bili,
    username_xbox
  }: { [key: string]: string } = ctx.request.body as { [key: string]: string };

  const CONFIG_CONTENT: string = `# ==============================
# Mcbbsmis Configs File
# Author Info:
# GitHub: Mcbbsmis
# Npm: Mcbbsmis
# BiliBili: lZiMUl
# ==============================

# ==============================
# Global Settings
# ==============================
[global]
# Host address to listen on. Default '0.0.0.0' means all network interfaces.
host = "${host}"

# Port to listen on.
port = ${port}

# Program language. Options:
# en_US (default) - English
# ru_RU          - Russian
# zh_CN          - Simplified Chinese
# zh_TW          - Traditional Chinese (Taiwan)
language = "${language}"

# Command identifier used for in-game commands.
identifier = "${identifier}"

# ==============================
# Options - Feature Toggles
# ==============================
[options]
# Show welcome message on startup
join = ${parseToggle(join)}

# Listen to share/interaction events
follow = ${parseToggle(follow)}

# Listen to share room events
share = ${parseToggle(share)}

# Show viewer count
view = ${parseToggle(view)}

# Show online count
online = ${parseToggle(online)}

# Listen to like events
like = ${parseToggle(like)}

# Listen to chat messages (danmaku)
danmaku = ${parseToggle(danmaku)}

# Listen to gift events
gift = ${parseToggle(gift)}

# ==============================
# BiliBili Settings
# ==============================
[bilibili] 
# Live room ID
roomid = ${roomid}

# BiliBili user ID
userid = ${userid}

# BiliBili username
username = "${username_bili}" 

# ==============================
# Client Settings
# ==============================
[xbox]
# Game client username (used to identify commands)
username = "${username_xbox}"

`;

  writeFileSync(Config.CONFIG_FILE_PATH, CONFIG_CONTENT);
  ctx.body = '<script>window.location.replace(window.location.origin)</script>';
  setTimeout((): never => process.exit(0), 2 * 1000);
});

export default router;
