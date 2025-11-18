import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import Config from '../config';
import BaseUnit from './BaseUnit';
import LanguageEnum from '../enum/LanguageEnum';
import OptionsUnit, { IOptionsG } from './OptionsUnit';
import App from '../index';

function saveFile(path: string, data: string): void {
  writeFileSync(path, data, {
    encoding: 'utf-8',
    flag: 'w'
  });
}

function InitUnit(force: boolean | any = false): void {
  if (!existsSync(Config.CONFIG_PATH))
    mkdirSync(Config.CONFIG_PATH, { recursive: true });
  const configExists: boolean = existsSync(Config.CONFIG_FILE_PATH);
  if (!configExists) {
    Config.LOGGER.warn(Config.LANGUAGE.get('#1'));
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    OptionsUnit().then((result: IOptionsG): void => {
      saveFile(Config.CONFIG_FILE_PATH, BaseUnit.ConfigurationTemplate(result));
      App();
    });
  }
  if (force) {
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    saveFile(
      Config.CONFIG_FILE_PATH,
      BaseUnit.ConfigurationTemplate({
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
      })
    );
    App();
  }
  if (configExists) {
    App();
  }
}

export default InitUnit;
