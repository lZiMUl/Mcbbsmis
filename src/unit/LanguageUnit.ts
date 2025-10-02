import { resolve, join } from 'node:path';
import ILanguage from '../interface/ILanguage';
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
    try {
      existsSync(LanguageConfig.CONFIG_FILE_PATH);
    } catch (e) {
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
  private readonly language: Array<ILanguage>;

  public constructor(rootPath: string) {
    this.language = this.parseFile(rootPath);
  }
  private tryReadFile(path: string, lang: LanguageEnum): string {
    return readFileSync(join(path, 'lang', `${lang}.lang`), {
      encoding: 'utf-8',
      flag: 'r'
    });
  }
  private readFile(path: string): string {
    try {
      return this.tryReadFile(path, LanguageConfig.get('global', 'language'));
    } catch (err) {
      return this.tryReadFile(path, LanguageUnit.DEFAULT_LANG);
    }
  }

  private parseFile(path: string): Array<ILanguage> {
    return this.readFile(path)
      .split('\r\n')
      .map((item: string): ILanguage => {
        return {
          key: item.substring(item.indexOf('"') + 1, item.lastIndexOf('"')),
          value: item.substring(item.indexOf('>') + 1, item.lastIndexOf('<'))
        };
      });
  }

  public get(key: string): string {
    return this.language
      .filter((language: ILanguage): string | void => {
        if (language.key === key) return language.value;
      })
      .at(0)?.value as string;
  }
}

export default LanguageUnit;
