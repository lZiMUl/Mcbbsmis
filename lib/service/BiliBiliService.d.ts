import EventEmitter from 'node:events';
import { KeepLiveWS } from 'tiny-bilibili-ws';
import { LiveEventEnum } from '../enum/LiveEventEnum';
import { ISendGift } from '../interface/IListenerResult';
declare class BiliBiliService extends EventEmitter {
    private static GiftHashMap;
    private readonly InteractWordV2;
    constructor(socket: KeepLiveWS);
    addService<T>(event: LiveEventEnum, cb: (data: T) => void, status?: boolean): void;
    giftDebounce<T extends ISendGift>(cb: ({ uname, action, giftName, num }: T) => void, { uname, action, giftName, num }: T): void;
    private debounce;
}
export default BiliBiliService;
//# sourceMappingURL=BiliBiliService.d.ts.map