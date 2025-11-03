import LanguageEnum from '../enum/LanguageEnum';

interface IConfigurationTemplate {
  host: string;
  port: number;
  language: LanguageEnum;
  identifier: string;
  join: boolean;
  follow: boolean;
  share: boolean;
  view: boolean;
  online: boolean;
  like: boolean;
  danmaku: boolean;
  gift: boolean;
  roomid: number;
  userid: number;
  username_bili: string;
  username_xbox: string;
}

export default IConfigurationTemplate;
