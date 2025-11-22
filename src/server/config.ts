// @ts-ignore
import { name, version } from '../package.json';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

import log4js, { Log4js, Logger } from 'log4js';
import { parse } from 'toml';

import LanguageUnit from './unit/LanguageUnit';
import IGlobalConfig from './interface/IGlobalConfig';
import InitUnit from './unit/InitUnit';
import ProfileManager from './unit/ProfileManagerUnit';

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
  public static readonly CONFIG_ROOT_PATH: string = join(
    Config.ROOT_PATH,
    'config'
  );
  public static readonly PROFILES_FILE_PATH: string = join(
    Config.CONFIG_ROOT_PATH,
    'profiles.json'
  );
  public static readonly PROFILES_DIR_PATH: string = join(
    Config.CONFIG_ROOT_PATH,
    'profiles'
  );
  public static readonly COOKIES_DIR_PATH: string = join(
    Config.CONFIG_ROOT_PATH,
    'cookies'
  );
  public static readonly PROTO_PATH: string = join(Config.ROOT_PATH, 'proto');
  public static readonly PROTO_FILE_PATH: string = join(
    Config.PROTO_PATH,
    'InteractWordV2.proto'
  );

  static readonly ProfileManager: ProfileManager = ProfileManager.create(
    Config.PROFILES_FILE_PATH
  );

  // Update Config
  public static readonly UPDATE_URL: string =
    'https://projects.lzimul.com/Mcbbsmis/update_info';

  // i18n Config
  public static readonly LANGUAGE: LanguageUnit = new LanguageUnit(
    Config.ROOT_PATH
  );

  //log4js Config
  public static readonly Log4js: Log4js = log4js.configure({
    appenders: {
      console: { type: 'console' },
      [Config.APP_NAME]: {
        type: 'dateFile',
        filename: `./logs/${Config.APP_NAME}`,
        pattern: '-yyyy-MM-dd-HH-mm-ss.log',
        alwaysIncludePattern: true
      },

      [`${Config.APP_NAME}-Filter`]: {
        type: 'logLevelFilter',
        appender: Config.APP_NAME,
        level: 'trace',
        maxLevel: 'fatal'
      }
    },
    categories: {
      default: {
        appenders: ['console', `${Config.APP_NAME}-Filter`],
        level: 'info'
      },
      [Config.APP_NAME]: {
        appenders: ['console', `${Config.APP_NAME}-Filter`],
        level: 'info'
      }
    }
  });
  public static readonly LOGGER: Logger = log4js.getLogger(Config.APP_NAME);

  public static CONFIG_CONTENT: IGlobalConfig;

  public static get getProfilePath(): string {
    return Config.ProfileManager.getFilePathById(
      Config.ProfileManager.getLastUsed
    );
  }

  public static reload(): void {
    try {
      Config.LANGUAGE.reload();
      Config.CONFIG_CONTENT = parse(
        readFileSync(Config.getProfilePath, {
          encoding: 'utf-8',
          flag: 'r'
        })
      );
    } catch (error) {
      Config.LOGGER.error(Config.LANGUAGE.get('#7'));
      InitUnit(true);
    }
  }

  public static get<
    T extends keyof IGlobalConfig,
    V extends keyof IGlobalConfig[T]
  >(root: T, key: V): IGlobalConfig[T][V] {
    try {
      if (!Config.CONFIG_CONTENT) {
        Config.reload();
      }
      const data: IGlobalConfig[T][V] = Config.CONFIG_CONTENT[root][key];
      Config.LOGGER.info(
        `${Config.LANGUAGE.get('#6')}: [${root} -> ${key as string}] => ${data}`
      );
      if (data === void 0) throw new Error();
      return data;
    } catch (error) {
      Config.LOGGER.error(Config.LANGUAGE.get('#7'));
      InitUnit(true);
      return this.get(root, key);
    }
  }
}

export default Config;
