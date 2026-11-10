export class ParseCookie {
  private readonly cookie: string;

  public constructor(cookie: string) {
    this.cookie = cookie;
  }

  public get<T = string>(key: string): T | undefined {
    for (const item of this.cookie.split(';')) {
      const index = item.indexOf('=');
      if (index === -1) {
        continue;
      }
      const cookieKey = item.slice(0, index).trim();
      const cookieValue = item.slice(index + 1);
      if (cookieKey === key) {
        return cookieValue as T;
      }
    }
    return void 0;
  }
}
