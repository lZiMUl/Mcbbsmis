import IConfigurationTemplate from '../interface/IConfigurationTemplate';
import Config from '../config';
import IProfileTemplate, { IProfile } from '../interface/IProfileTemplate';
import { writeFileSync } from 'node:fs';

type TLogSeparator = (title: string, i?: number | undefined) => void;

class BaseUnit {
  public static debounce<T>(
    cb: (data: T) => void,
    delay: number
  ): (data?: T) => void {
    let time: NodeJS.Timeout;
    return function (data?: T): void {
      clearTimeout(time);
      time = setTimeout((): void => cb(data as T), delay * 1000);
    };
  }

  public static ProfileTemplate({
    lastUsed,
    profiles
  }: IProfileTemplate): string {
    return JSON.stringify(
      {
        lastUsed,
        profiles: [
          ...profiles.map((data: IProfile): IProfile => {
            return { ...data, createTime: new Date().getTime() };
          })
        ]
      },
      null,
      2
    );
  }

  public static ConfigurationTemplate({
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
  }: IConfigurationTemplate): string {
    return `# ==============================
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
# Options - Listen To Events
# ==============================
[options]
# Show welcome message on startup
join = ${join}

# Listen to share/interaction events
follow = ${follow}

# Listen to share room events
share = ${share}

# Show viewer count
view = ${view}

# Show online count
online = ${online}

# Listen to like events
like = ${like}

# Listen to chat messages (danmaku)
danmaku = ${danmaku}

# Listen to gift events
gift = ${gift}

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
  }

  public static logSeparator(max: number): TLogSeparator {
    return function (title: string, i?: number): void {
      Config.LOGGER.info(
        `\n──────────────  ${title} ${i ? `[${i}/${max}] ` : ''} ──────────────\n`
      );
    };
  }

  public static saveFile(path: string, data: string): void {
    writeFileSync(path, data, {
      encoding: 'utf-8',
      flag: 'w'
    });
  }
}

export default BaseUnit;
export type { TLogSeparator };
