declare class Cookie {
    private readonly path;
    constructor(path?: string);
    has(username: string): boolean;
    get(username: string): string;
    set(username: string, cookie: string): void;
    delete(username: string): void;
}
declare class AuthUnit extends Cookie {
    static readonly QRCODE_URL: string;
    private static AuthUnit;
    private headers;
    private constructor();
    static create(username: string): AuthUnit;
    private getUser;
}
export default AuthUnit;
//# sourceMappingURL=AuthUnit.d.ts.map