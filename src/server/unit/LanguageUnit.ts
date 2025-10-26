import { join, resolve } from 'node:path';
import LanguageEnum from '../enum/LanguageEnum';
import IGlobalConfig from '../interface/IGlobalConfig';
import { existsSync, readFileSync } from 'node:fs';
import InitUnit from './InitUnit';
import { parse } from 'toml';

class LanguageConfig {
  public static readonly ROOT_PATH: string = resolve('.');
  public static readonly CONFIG_PATH: string = join(
    LanguageConfig.ROOT_PATH,
    'config'
  );
  public static readonly CONFIG_FILE_PATH: string = join(
    LanguageConfig.CONFIG_PATH,
    'default.toml'
  );
  public static get<
    T extends keyof IGlobalConfig,
    V extends keyof IGlobalConfig[T]
  >(root: T, key: V): IGlobalConfig[T][V] {
    if (!existsSync(LanguageConfig.CONFIG_FILE_PATH)) {
      InitUnit();
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

class LanguageUnit {
  private static DEFAULT_LANG: LanguageEnum = LanguageEnum.EN_US;
  public readonly regExp: RegExp = /<string key="([^"]+)">([^<]+)<\/string>/;
  private readonly language: Map<string, string> = new Map<string, string>();

  public constructor(rootPath: string) {
    this.readFile(rootPath)
      .split('\n')
      .forEach((item: string): void => {
        const data: RegExpMatchArray | null = item.match(this.regExp);
        if (data) {
          const [_, key, value]: RegExpMatchArray = data;
          if (!this.language.has(key)) {
            this.language.set(key, value);
          }
        }
      });
  }

  public get(key: string): string {
    return this.language.get(key) as string;
  }

  private tryReadFile(path: string, lang: LanguageEnum): string {
    try {
      return readFileSync(join(path, 'lang', `${lang}.lang`), {
        encoding: 'utf-8',
        flag: 'r'
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(
          `Failed to read language file for ${lang}: ${err.message}`
        );
      } else {
        throw new Error(
          'Unknown error occurred while reading the language file.'
        );
      }
    }
  }

  private readFile(path: string): string {
    try {
      return this.tryReadFile(path, LanguageConfig.get('global', 'language'));
    } catch (err: unknown) {
      return this.tryReadFile(path, LanguageUnit.DEFAULT_LANG);
    }
  }
}

export default LanguageUnit;
