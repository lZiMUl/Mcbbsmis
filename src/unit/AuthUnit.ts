import { join, resolve } from 'node:path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync
} from 'node:fs';

import axios, { AxiosHeaders } from 'axios';
import QrcodeTerminal from 'qrcode-terminal';

import Config from '../config';

class Cookie {
  private readonly path: string;

  public constructor(path: string = './config/cookies/') {
    this.path = join(resolve(), path);
  }
  public has(username: string): boolean {
    mkdirSync(this.path, { recursive: true });
    return existsSync(join(this.path, `./${username}.txt`));
  }

  public get(username: string): string {
    return readFileSync(join(this.path, `./${username}.txt`), {
      encoding: 'utf-8',
      flag: 'r'
    });
  }

  public set(username: string, cookie: string): void {
    writeFileSync(join(this.path, `./${username}.txt`), cookie, {
      encoding: 'utf-8',
      flag: 'w'
    });
  }

  public delete(username: string): void {
    rmSync(join(this.path, `./${username}.txt`), {
      force: true,
      retryDelay: 3000
    });
  }
}

class AuthUnit extends Cookie {
  private static AuthIn: AuthUnit;
  public static readonly QRCODE_URL: string =
    'https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header';
  private headers = new AxiosHeaders({
    'User-Agent': 'PostmanRuntime/7.43.0',
    Origin: 'https://www.bilibili.com',
    Referer: 'https://www.bilibili.com'
  });

  private constructor(username: string) {
    super();
    this.getUser(username);
  }

  private async getUser(username: string): Promise<void> {
    if (!super.has(username)) {
      Config.LOGGER.warn(Config.LANGUAGE.get('#9'));
      try {
        const {
          data: {
            data: { url, qrcode_key }
          }
        } = await axios({
          url: AuthUnit.QRCODE_URL,
          method: 'GET',
          headers: this.headers
        });
        Config.LOGGER.info(Config.LANGUAGE.get('#10'));
        QrcodeTerminal.generate(url, qrcode_key);
        const checkLogin = setInterval(async (): Promise<void> => {
          const data = await axios({
            url: `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}&source=main-fe-header`,
            method: 'GET',
            headers: this.headers
          });
          const {
            data: {
              data: { code }
            }
          } = data;
          switch (code) {
            case 0:
              {
                Config.LOGGER.info(Config.LANGUAGE.get('#13'));
                super.set(
                  username,
                  Reflect.get(data.headers, 'set-cookie')?.join('; ') as string
                );
                clearInterval(checkLogin);
              }
              break;

            case 86090:
              {
                Config.LOGGER.info(Config.LANGUAGE.get('#12'));
              }
              break;

            case 86101:
              {
                Config.LOGGER.info(Config.LANGUAGE.get('#11'));
              }
              break;

            default: {
              Config.LOGGER.warn(`${Config.LANGUAGE.get('#14')} ${code}`);
              super.delete(username);
              process.exit(0);
            }
          }
        }, 2000);
      } catch (e) {
        Config.LOGGER.error(Config.LANGUAGE.get('#21'));
        super.delete(username);
        process.exit(0);
      }
    }
  }

  public static create(username: string = Config.APP_UUID): AuthUnit {
    if (!AuthUnit.AuthIn) {
      AuthUnit.AuthIn = new AuthUnit(username);
    }
    return AuthUnit.AuthIn;
  }
}

export default AuthUnit;
