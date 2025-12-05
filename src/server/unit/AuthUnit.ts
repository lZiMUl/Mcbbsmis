import axios, { AxiosHeaders } from 'axios';
import QrcodeTerminal from 'qrcode-terminal';

import Config from '../config';
import BaseUnit from './BaseUnit';
import Cookie from './Cookie';

class AuthUnit extends Cookie {
  public static readonly QRCODE_URL: string =
    'https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header';
  private static INSTANCE: AuthUnit;
  private headers = new AxiosHeaders({
    'User-Agent': 'PostmanRuntime/7.43.0',
    Origin: 'https://www.bilibili.com',
    Referer: 'https://www.bilibili.com'
  });

  private constructor(uuid: string) {
    super();
    this.getUser(uuid);
  }

  public static create(uuid: string): AuthUnit {
    if (!AuthUnit.INSTANCE) {
      AuthUnit.INSTANCE = new AuthUnit(uuid);
    }
    return AuthUnit.INSTANCE;
  }

  private async getUser(uuid: string): Promise<void> {
    if (!super.has(uuid)) {
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
                  uuid,
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
              Config.LOGGER.error(`${Config.LANGUAGE.get('#14')} ${code}`);
              super.delete(uuid);
              BaseUnit.exitWithMessage();
            }
          }
        }, 2000);
      } catch (err: unknown) {
        Config.LOGGER.error(Config.LANGUAGE.get('#21'));
        super.delete(uuid);
        BaseUnit.exitWithMessage();
      }
    }
  }
}

export default AuthUnit;
