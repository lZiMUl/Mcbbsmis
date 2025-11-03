import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import Config from '../config';
import BaseUnit from './BaseUnit';
import LanguageEnum from '../enum/LanguageEnum';

const INIT_CONFIG_CONTENT: string = BaseUnit.ConfigurationTemplate({
  host: '0.0.0.0',
  port: 5700,
  language: LanguageEnum.EN_US,
  identifier: '$',
  join: false,
  follow: false,
  share: false,
  view: false,
  online: false,
  like: true,
  danmaku: true,
  gift: true,
  roomid: 9329583,
  userid: 291883246,
  username_bili: 'lZiMUl',
  username_xbox: 'lZiMUl'
});

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
