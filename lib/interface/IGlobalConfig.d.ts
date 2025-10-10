import LanguageEnum from '../enum/LanguageEnum';
type toggle = boolean;
interface IGlobalConfig {
    global: {
        host: string;
        port: number;
        language: LanguageEnum;
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
//# sourceMappingURL=IGlobalConfig.d.ts.map