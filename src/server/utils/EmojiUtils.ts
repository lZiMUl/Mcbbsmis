import { readFileSync } from 'fs';
import Config from '../config';

interface IData {
  name: string;
  code: string;
}

type TKv = Map<IData['name'], IData['code']>;
type TVk = Map<IData['code'], IData['name']>;

class EmojiUtils {
  private static INSTANCE: EmojiUtils;
  private readonly kv: TKv = new Map<IData['name'], IData['code']>();
  private readonly vk: TVk = new Map<IData['code'], IData['name']>();

  private constructor(path: string) {
    this.load(path);
  }

  public static create(path: string): EmojiUtils {
    if (!EmojiUtils.INSTANCE) {
      return new EmojiUtils(path);
    }
    return EmojiUtils.INSTANCE;
  }

  public getCodeByName(name: string): string {
    return this.kv.get(name) ?? name;
  }

  public getNameByCode(code: string): string {
    return this.vk.get(code) ?? code;
  }

  private load(path: string): void {
    try {
      const data: Array<IData> = JSON.parse(
        readFileSync(path, {
          encoding: 'utf-8',
          flag: 'r'
        })
      );

      for (const { name, code } of data) {
        this.kv.set(name, code);
        this.vk.set(code, name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Config.LOGGER.error(error);
      }
    }
  }
}

export default EmojiUtils;
