import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import Config from '../config';

const INIT_CONFIG_CONTENT: string = `# ==============================
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
host = '0.0.0.0'

# Port to listen on.
port = 5700

# Program language. Options:
# en_US (default) - English
# ru_RU          - Russian
# zh_CN          - Simplified Chinese
# zh_TW          - Traditional Chinese (Taiwan)
language = 'en_US'

# Command identifier used for in-game commands.
identifier = '$'

# ==============================
# Options - Feature Toggles
# ==============================
[options]
# Show welcome message on startup
join = false

# Listen to share/interaction events
follow = false

# Listen to share room events
share = false

# Show viewer count
view = false

# Show online count
online = false

# Listen to like events
like = true

# Listen to chat messages (danmaku)
danmaku = true

# Listen to gift events
gift = true

# ==============================
# BiliBili Settings
# ==============================
[bilibili] 
# Live room ID
roomid = 9329583

# BiliBili user ID
userid = 291883246

# BiliBili username
username = 'lZiMUl' 

# ==============================
# Client Settings
# ==============================
[xbox]
# Game client username (used to identify commands)
username = 'lZiMUl'

`;

function InitUnit(force: boolean = false): void {
  if (!existsSync(Config.CONFIG_PATH))
    mkdirSync(Config.CONFIG_PATH, { recursive: true });
  const configExists: boolean = existsSync(Config.CONFIG_FILE_PATH);
  if (!configExists) Config.LOGGER.warn(Config.LANGUAGE.get('#1'));
  if (!configExists || force) {
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    writeFileSync(Config.CONFIG_FILE_PATH, INIT_CONFIG_CONTENT, {
      encoding: 'utf-8',
      flag: 'w'
    });
  }
}

export default InitUnit;
