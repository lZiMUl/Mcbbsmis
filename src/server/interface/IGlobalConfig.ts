import ELanguage from '../enum/ELanguage';

interface IGlobalConfig {
  global: {
    host: string;
    port: number;
    language: ELanguage;
    identifier: string;
  };
  options: {
    join: boolean;
    follow: boolean;
    share: boolean;
    view: boolean;
    online: boolean;
    like: boolean;
    danmaku: boolean;
    gift: boolean;
  };
  bilibili: {
    roomid: number;
    userid: number;
    username: string;
  };
  xbox: {
    username: string;
  };
  crossPlatform: {
    geyser: boolean;
    floodgate: boolean;
  };
}

export default IGlobalConfig;
