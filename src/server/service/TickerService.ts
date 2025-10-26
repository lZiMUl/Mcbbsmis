import { setInterval } from 'node:timers';

class TickerService<T> {
  private cache: Map<string, T> = new Map<string, T>();

  public getData<V extends T>(key: string): V | null {
    return this.cache.has(key) ? (this.cache.get(key) as V) : null;
  }
  public setData(key: string, value: T): void {
    this.cache.set(key, value);
  }

  public tick(cb: () => void, time = 1) {
    setInterval(cb, time * 1000);
  }
}

export default TickerService;
