// @ts-ignore
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import ELanguage from '../enum/ELanguage';
import Config from '../config';
import BaseUnit, { TLogSeparator } from './BaseUnit';

interface IOptions {
  join: boolean;
  follow: boolean;
  share: boolean;
  view: boolean;
  online: boolean;
  like: boolean;
  danmaku: boolean;
  gift: boolean;
}

interface IOptionsG extends IOptions {
  host: string;
  port: number;
  language: ELanguage;
  identifier: string;
  roomid: number;
  userid: number;
  username_bili: string;
  username_xbox: string;
}

function OptionsG(data: Array<keyof IOptions>): IOptions {
  const options: IOptions = {
    join: false,
    follow: false,
    share: false,
    view: false,
    online: false,
    like: false,
    danmaku: false,
    gift: false
  };
  for (const item of data) {
    options[item] = true;
  }

  return options;
}

const max: number = 3;

const retryBar: TLogSeparator = BaseUnit.logSeparator(max);
const stepBar: TLogSeparator = BaseUnit.logSeparator(4);

async function OptionsUnit(i: number = 1): Promise<IOptionsG | void> {
  try {
    if (i > max) {
      Config.LOGGER.warn('Too many failed attempts. Exiting.');
      process.exit(0);
    }

    retryBar('Retry Bar', i);
    // Language
    stepBar('Choose Language', 1);
    const language: ELanguage = await select({
      message: 'Language: ',
      choices: [
        {
          name: 'English',
          value: ELanguage.EN_US
        },
        {
          name: 'русский язык',
          value: ELanguage.RU_RU
        },
        {
          name: '简体中文',
          value: ELanguage.ZH_CN
        },
        {
          name: '繁體中文',
          value: ELanguage.ZH_TW
        },
        {
          name: '日本語',
          value: ELanguage.JA_JP
        },
        {
          name: 'Français',
          value: ELanguage.FR_FR
        },
        {
          name: 'Deutsch',
          value: ELanguage.DE_DE
        }
      ]
    });

    // Configure
    stepBar('Next: Configure Host/Port/User', 2);
    const [
      host,
      port,
      identifier,
      roomid,
      userid,
      username_bili,
      username_xbox
    ]: [string, number, string, number, number, string, string] = [
      await input({ message: 'Host: ', default: '0.0.0.0', required: true }),
      await number({ message: 'Port: ', default: 5700, required: true }),
      await input({
        message: 'Command Identifier: ',
        default: '$',
        required: true,
        pattern: /^[!-/:-@[-`{-~]$/,
        patternError: 'Identifier must be exactly 1 ASCII symbol character'
      }),
      await number({
        message: 'BiliBili Room Number: ',
        default: 9329583,
        required: true
      }),
      await number({
        message: 'BiliBili UserID: ',
        default: 291883246,
        required: true
      }),
      await input({
        message: 'BiliBili Username: ',
        default: 'lZiMUl',
        required: true
      }),
      await input({
        message: 'Minecraft Username: ',
        default: 'lZiMUl',
        required: true
      })
    ];

    // Events
    stepBar('Next: Select Listen Events', 3);
    const options: IOptions = OptionsG(
      await checkbox({
        message: 'Listen Events: ',
        choices: [
          { name: 'Join', value: 'join' },
          { name: 'Follow', value: 'follow' },
          { name: 'Share', value: 'share' },
          { name: 'View', value: 'view' },
          { name: 'Online', value: 'online' },
          { name: 'Like', value: 'like', checked: true },
          { name: 'Danmaku', value: 'danmaku', checked: true },
          { name: 'Gift', value: 'gift', checked: true }
        ],
        required: true
      })
    );

    // Continue
    stepBar('Final Step: Is the current configuration correct?', 4);
    if (!(await confirm({ message: 'Continue?', default: false }))) {
      return await OptionsUnit(i + 1);
    }

    return {
      host,
      port,
      language,
      identifier,
      roomid,
      userid,
      username_bili,
      username_xbox,
      ...options
    };
  } catch (error) {
    Config.LOGGER.warn('Project was forcibly stopped by the user.');
  }
}

export default OptionsUnit;
export type { IOptions, IOptionsG };
