import { Logger } from 'log4js';
import LanguageUnit from './unit/LanguageUnit';
import IGlobalConfig from './interface/IGlobalConfig';
declare class Config {
    static readonly APP_NAME: string;
    static readonly APP_VERSION: string;
    static readonly APP_UUID: string;
    static readonly ROOT_PATH: string;
    static readonly CONFIG_PATH: string;
    static readonly CONFIG_FILE_PATH: string;
    static readonly PROTO_PATH: string;
    static readonly PROTO_FILE_PATH: string;
    static readonly UPDATE_URL: string;
    static readonly LANGUAGE: LanguageUnit;
    static readonly LOGGER: Logger;
    static readonly LOGGER_CONFIG: 'info';
    static get<T extends keyof IGlobalConfig, V extends keyof IGlobalConfig[T]>(root: T, key: V): IGlobalConfig[T][V];
}
export default Config;
//# sourceMappingURL=config.d.ts.map