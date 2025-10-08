declare class TickerService<T> {
    private cache;
    getData<V extends T>(key: string): V | null;
    setData(key: string, value: T): void;
    tick(cb: () => void, time?: number): void;
}
export default TickerService;
//# sourceMappingURL=TickerService.d.ts.map