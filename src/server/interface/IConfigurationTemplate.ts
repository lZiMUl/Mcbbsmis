import ELanguage from '../enum/ELanguage';

interface IConfigurationTemplate {
  host: string;
  port: number;
  language: ELanguage;
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
  resourcePack: boolean;
  geyser: boolean;
  floodgate: boolean;
}

export default IConfigurationTemplate;
