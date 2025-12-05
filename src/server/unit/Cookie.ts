import { join } from 'node:path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';

import Config from '../config';

class Cookie {
  private readonly path: string;

  public constructor(path: string = Config.COOKIES_DIR_PATH) {
    this.path = path;
    if (!existsSync(this.path)) mkdirSync(this.path, { recursive: true });
  }
  public has(uuid: string): boolean {
    return existsSync(join(this.path, `./${uuid}.txt`));
  }

  public get(uuid: string): string {
    return readFileSync(join(this.path, `./${uuid}.txt`), {
      encoding: 'utf-8',
      flag: 'r'
    });
  }

  public set(uuid: string, cookie: string): void {
    writeFileSync(join(this.path, `./${uuid}.txt`), cookie, {
      encoding: 'utf-8',
      flag: 'w'
    });
  }

  public delete(uuid: string): void {
    rmSync(join(this.path, `./${uuid}.txt`), {
      force: true,
      retryDelay: 1000
    });
  }
}

export default Cookie;
