import ELanguage from '../enum/ELanguage';

type toggle = boolean;

interface IGlobalConfig {
  global: {
    host: string;
    port: number;
    language: ELanguage;
    identifier: string;
  };
  options: {
    join: toggle;
    follow: toggle;
    share: toggle;
    view: toggle;
    online: toggle;
    like: toggle;
    danmaku: toggle;
    gift: toggle;
  };
  bilibili: {
    roomid: number;
    userid: number;
    username: string;
  };
  xbox: {
    username: string;
  };
}

export default IGlobalConfig;
