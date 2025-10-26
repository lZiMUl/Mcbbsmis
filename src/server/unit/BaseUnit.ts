class BaseUnit {
  public static debounce<T>(
    cb: (data: T) => void,
    delay: number
  ): (data?: T) => void {
    let time: NodeJS.Timeout;
    return function (data?: T): void {
      clearTimeout(time);
      time = setTimeout((): void => cb(data as T), delay * 1000);
    };
  }
}

export default BaseUnit;
