// @ts-ignore
import { input, number, select, checkbox, confirm } from '@inquirer/prompts';
import LanguageEnum from '../enum/LanguageEnum';

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
  language: LanguageEnum;
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

async function OptionsUnit(): Promise<IOptionsG> {
  const language: LanguageEnum = await select({
    message: 'Languages: ',
    choices: [
      {
        name: 'English',
        value: LanguageEnum.EN_US
      },
      {
        name: 'русский язык',
        value: LanguageEnum.RU_RU
      },
      {
        name: '简体中文',
        value: LanguageEnum.ZH_CN
      },
      {
        name: '繁體中文',
        value: LanguageEnum.ZH_TW
      },
      {
        name: '日本語',
        value: LanguageEnum.JA_JP
      },
      {
        name: 'Français',
        value: LanguageEnum.FR_FR
      },
      {
        name: 'Deutsch',
        value: LanguageEnum.DE_DE
      }
    ]
  });

  const [
    host,
    port,
    identifier,
    roomid,
    userid,
    username_bili,
    username_xbox
  ]: [string, number, string, number, number, string, string] = [
    await input({ message: 'Host: ', default: '0.0.0.0' }),
    (await number({ message: 'Port: ', default: 5700 })) as number,
    await input({
      message: 'Command Identifier: ',
      default: '$',
      pattern: /[-/\\^$*+?.()|[\]{}]/g,
      patternError: 'Identifier length 1 only'
    }),
    (await number({
      message: 'BiliBili Room Number: ',
      required: true,
      default: 9329583
    })) as number,
    (await number({
      message: 'BiliBili UserID: ',
      required: true,
      default: 291883246
    })) as number,
    await input({
      message: 'BiliBili Username: ',
      required: true,
      default: 'lZiMUl'
    }),
    await input({
      message: 'Minecraft Username: ',
      required: true,
      default: 'lZiMUl'
    })
  ];

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
      ]
    })
  );

  if (!(await confirm({ message: 'Continue?' }))) {
    await OptionsUnit();
  }

  return {
    host,
    port,
    language,
    identifier,
    join: options.join,
    follow: options.follow,
    share: options.share,
    view: options.view,
    online: options.online,
    like: options.like,
    danmaku: options.danmaku,
    gift: options.gift,
    roomid,
    userid,
    username_bili,
    username_xbox
  };
}

export default OptionsUnit;
export type { IOptions, IOptionsG };
