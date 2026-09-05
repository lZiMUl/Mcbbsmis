import { join, resolve } from 'node:path';
import ELanguage from '../enum/ELanguage';
import IGlobalConfig from '../interface/IGlobalConfig';
import { existsSync, readFileSync } from 'node:fs';
import InitUtils from './InitUtils';
import { parse } from 'toml';
import ProfileManager from './ProfileManagerUtils';
import Config from '../config';

class LanguageConfig {
  public static readonly ROOT_PATH: string = resolve('.');
  public static readonly CONFIG_ROOT_PATH: string = join(
    LanguageConfig.ROOT_PATH,
    'config'
  );
  public static readonly PROFILES_DIR_PATH: string = join(
    LanguageConfig.CONFIG_ROOT_PATH,
    'profiles'
  );
  public static readonly ProfileManager: ProfileManager = ProfileManager.create(
    LanguageConfig.PROFILES_DIR_PATH
  );
  static CONFIG_FILE_PATH: string =
    LanguageConfig.ProfileManager.getFilePathById(
      LanguageConfig.ProfileManager.getLastUsed
    );

  public static get<
    T extends keyof IGlobalConfig,
    V extends keyof IGlobalConfig[T]
  >(root: T, key: V): IGlobalConfig[T][V] {
    if (!existsSync(LanguageConfig.CONFIG_FILE_PATH)) {
      InitUtils();
    }

    const CONFIG_CONTENT: IGlobalConfig = parse(
      readFileSync(LanguageConfig.CONFIG_FILE_PATH, {
        encoding: 'utf-8',
        flag: 'r'
      })
    );
    return CONFIG_CONTENT[root][key];
  }
}

class LanguageUtils {
  private static DEFAULT_LANG: ELanguage = ELanguage.EN_US;
  public readonly regExp: RegExp =
    /<string\s+key="#(\d+)">\s*([\s\S]*?)\s*<\/string>/g;
  private readonly rootPath: string;
  private language: Map<string, string> = new Map<string, string>();

  public constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.load(rootPath);
  }

  public reload(): void {
    this.language = new Map<string, string>();
    LanguageConfig.CONFIG_FILE_PATH = Config.getProfilePath;
    this.load(this.rootPath);
  }

  public get(key: string): string {
    return this.language.get(key) as string;
  }

  private load(path: string): void {
    this.readFile(path)
      .matchAll(this.regExp)
      ?.forEach((data: RegExpExecArray): void => {
        if (data) {
          const [_, key, value]: RegExpMatchArray = data;
          const trimmedKey: string = `#${key}`;
          if (!this.language.has(trimmedKey)) {
            this.language.set(trimmedKey, value);
          }
        }
      });
  }

  private tryReadFile(path: string, lang: ELanguage): string {
    try {
      return readFileSync(join(path, 'lang', `${lang}.lang`), {
        encoding: 'utf-8',
        flag: 'r'
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(
          `Failed to read language file for ${lang}: ${err.message}`,
          { cause: err }
        );
      } else {
        throw new Error(
          'Unknown error occurred while reading the language file.',
          { cause: err }
        );
      }
    }
  }

  private readFile(path: string): string {
    try {
      return this.tryReadFile(path, LanguageConfig.get('global', 'language'));
    } catch {
      return this.tryReadFile(path, LanguageUtils.DEFAULT_LANG);
    }
  }
}

export default LanguageUtils;
