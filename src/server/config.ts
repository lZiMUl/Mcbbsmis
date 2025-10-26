// @ts-ignore
import { name, version } from '../package.json';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import log4js, { Logger } from 'log4js';
import { parse } from 'toml';

import LanguageUnit from './unit/LanguageUnit';
import IGlobalConfig from './interface/IGlobalConfig';
import InitUnit from './unit/InitUnit';

class Config {
  // App Config
  public static readonly APP_NAME: string = name
    .split('')
    .map((item: string, index: number): string =>
      !index ? item.toUpperCase() : item.toLowerCase()
    )
    .join('');
  public static readonly APP_VERSION: string = version;
  public static readonly APP_UUID: string =
    '9f7eb9ce-6a2a-4267-8923-494fd42ded83';

  // Path Config
  public static readonly ROOT_PATH: string = resolve('.');
  public static readonly CONFIG_PATH: string = join(Config.ROOT_PATH, 'config');
  public static readonly CONFIG_FILE_PATH: string = join(
    Config.CONFIG_PATH,
    'default.toml'
  );
  public static readonly PROTO_PATH: string = join(Config.ROOT_PATH, 'proto');
  public static readonly PROTO_FILE_PATH: string = join(
    Config.PROTO_PATH,
    'InteractWordV2.proto'
  );

  // Update Config
  public static readonly UPDATE_URL: string =
    'https://projects.lzimul.com/Mcbbsmis/update_info';

  // i18n Config
  public static readonly LANGUAGE: LanguageUnit = new LanguageUnit(
    Config.ROOT_PATH
  );

  //log4js Config
  public static readonly LOGGER: Logger = log4js.getLogger(Config.APP_NAME);
  public static readonly LOGGER_CONFIG: 'info' = (Config.LOGGER.level = 'info');

  public static get<
    T extends keyof IGlobalConfig,
    V extends keyof IGlobalConfig[T]
  >(root: T, key: V): IGlobalConfig[T][V] {
    try {
      const CONFIG_CONTENT: IGlobalConfig = parse(
        readFileSync(Config.CONFIG_FILE_PATH, {
          encoding: 'utf-8',
          flag: 'r'
        })
      );

      const data: IGlobalConfig[T][V] = CONFIG_CONTENT[root][key];
      Config.LOGGER.info(
        `${Config.LANGUAGE.get('#6')}: [${root} -> ${key as string}] => ${data}`
      );
      if (data === void 0) throw new Error();
      return data;
    } catch (e) {
      Config.LOGGER.error(Config.LANGUAGE.get('#7'));
      InitUnit(true);
      return this.get(root, key);
    }
  }
}

export default Config;
