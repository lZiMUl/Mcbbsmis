import LanguageEnum from '../enum/LanguageEnum';

interface IGlobalConfig {
  global: {
    host: string;
    port: number;
    language: LanguageEnum;
    command_prefix: string;
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
