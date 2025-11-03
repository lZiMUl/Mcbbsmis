import IConfigurationTemplate from '../interface/IConfigurationTemplate';
import LanguageEnum from '../enum/LanguageEnum';

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

  public static ConfigurationTemplate({
    host = '0.0.0.0',
    port = 5700,
    language = LanguageEnum.EN_US,
    identifier = '$',
    join = false,
    follow = false,
    share = false,
    view = false,
    online = false,
    like = false,
    danmaku = false,
    gift = false,
    roomid = 9329583,
    userid = 291883246,
    username_bili = 'lZiMUl',
    username_xbox = 'lZiMUl'
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
}

export default BaseUnit;
