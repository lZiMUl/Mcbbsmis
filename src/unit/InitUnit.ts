import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'path';
import Config from '../config';

const INIT_CONFIG_CONTENT: string = `#Mcbbsmis Configs File;

#GitHub: Mcbbsmis;
#Npm: Mcbbsmis;
#BiliBili: lZiMUl;

# Global Setting
[global]
host = '0.0.0.0'
port = 5700
language = 'en_US'
identifier = '$'

[options]
welcome = false
watch = false
online = false
like = true
danmu = true
gift = true
share = false

# BiliBili Setting
[bilibili] 
roomid = 9329583
userid = 291883246
username = 'lZiMUl' 

# Client Setting
[xbox]
username = 'lZiMUl'
`;

function InitUnit(): void {
  if (!existsSync(Config.CONFIG_FILE_PATH)) {
    mkdirSync(dirname(Config.CONFIG_FILE_PATH), { recursive: true });
    Config.LOGGER.warn(Config.LANGUAGE.get('#1'));
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    writeFileSync(Config.CONFIG_FILE_PATH, INIT_CONFIG_CONTENT, {
      encoding: 'utf-8',
      flag: 'w'
    });
  }
}

export default InitUnit;
