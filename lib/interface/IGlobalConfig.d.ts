import LanguageEnum from '../enum/LanguageEnum';
interface IGlobalConfig {
    global: {
        host: string;
        port: number;
        language: LanguageEnum;
        identifier: string;
    };
    options: {
        welcome: boolean;
        watch: boolean;
        online: boolean;
        like: boolean;
        danmu: boolean;
        gift: boolean;
        share: boolean;
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
//# sourceMappingURL=IGlobalConfig.d.ts.map