declare class LanguageUnit {
    private static DEFAULT_LANG;
    readonly regExp: RegExp;
    private readonly language;
    constructor(rootPath: string);
    get(key: string): string;
    private tryReadFile;
    private readFile;
}
export default LanguageUnit;
//# sourceMappingURL=LanguageUnit.d.ts.map