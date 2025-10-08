import EventEmitter from 'node:events';
import { KeepLiveWS } from 'tiny-bilibili-ws';
import { Event } from '../enum/ListenerEnum';
import { IGift } from '../interface/IListenerResult';
declare class BiliBiliService extends EventEmitter {
    private static GiftHashMap;
    constructor(socket: KeepLiveWS);
    addService<T>(event: Event, cb: (data: T) => void, status?: boolean): void;
    giftDebounce<T extends IGift>(cb: ({ uname, action, giftName, num }: T) => void, { uname, action, giftName, num }: T): void;
    private debounce;
}
export default BiliBiliService;
//# sourceMappingURL=BiliBiliService.d.ts.map