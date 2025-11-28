// @ts-ignore
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import ELanguage from '../enum/ELanguage';
import Config from '../config';
import BaseUnit, { TLogSeparator } from './BaseUnit';

interface IListenEventOptions {
  join: boolean;
  follow: boolean;
  share: boolean;
  view: boolean;
  online: boolean;
  like: boolean;
  danmaku: boolean;
  gift: boolean;
}

interface ICrossPlatformOptions {
  geyser: boolean;
  floodgate: boolean;
}

interface IOptionsGenerator extends IListenEventOptions, ICrossPlatformOptions {
  host: string;
  port: number;
  language: ELanguage;
  identifier: string;
  roomid: number;
  userid: number;
  username_bili: string;
  username_xbox: string;
  geyser: boolean;
  floodgate: boolean;
}

function EventOptionsGenerator(
  data: Array<keyof IListenEventOptions>
): IListenEventOptions {
  const options: IListenEventOptions = {
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

function CrossPlatformGenerator(
  data: Array<keyof ICrossPlatformOptions>
): ICrossPlatformOptions {
  const options: ICrossPlatformOptions = {
    geyser: false,
    floodgate: false
  };
  for (const item of data) {
    options[item] = true;
  }

  return options;
}

const max: number = 3;

const retryBar: TLogSeparator = BaseUnit.createLogSeparator(max);
const stepBar: TLogSeparator = BaseUnit.createLogSeparator(5);

async function OptionsUnit(i: number = 1): Promise<IOptionsGenerator | void> {
  try {
    if (i > max) {
      BaseUnit.exitWithMessage('Too many failed attempts. Exiting.');
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

    // Listen Event Options
    stepBar('Next: Select Listen Events', 3);
    const listenEventOptions: IListenEventOptions = EventOptionsGenerator(
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

    // Cross-Platform Options
    stepBar('Next: Choose whether to enable cross-platform support', 4);
    const crossPlatformOptions: ICrossPlatformOptions = CrossPlatformGenerator(
      await checkbox({
        message: 'Cross-Platform: ',
        choices: [
          { name: 'Geyser', value: 'geyser' },
          { name: 'Floodgate', value: 'floodgate' }
        ]
      })
    );

    // Continue
    stepBar('Final Step: Is the current configuration correct?', 5);
    if (!(await confirm({ message: 'Continue?', default: true }))) {
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
      ...listenEventOptions,
      ...crossPlatformOptions
    };
  } catch (error) {
    BaseUnit.exitWithMessage(Config.MESSAGE.FORCE_EXIT);
  }
}

export default OptionsUnit;
export type {
  IOptionsGenerator,
  IListenEventOptions,
  ICrossPlatformOptions,
  EventOptionsGenerator,
  CrossPlatformGenerator
};
