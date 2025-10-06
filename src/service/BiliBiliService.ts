import EventEmitter from 'node:events';
import { KeepLiveWS } from 'tiny-bilibili-ws';

import { Event } from '../enum/ListenerEnum';
import { IGift } from '../interface/IListenerResult';
import { encode } from 'node:punycode';

class BiliBiliService extends EventEmitter {
  private static GiftHashMap = new Map();
  public constructor(socket: KeepLiveWS) {
    super();

    socket.addListener(
      Event.DM_INTERACTION,
      ({
        data: {
          data: { data }
        }
      }): void => {
        super.emit(Event.DM_INTERACTION, {
          suffix_text: JSON.parse(data)
        });
      }
    );
    socket.addListener(
      Event.WATCHED_CHANGE,
      ({
        data: {
          data: { num }
        }
      }): void => {
        super.emit(Event.WATCHED_CHANGE, { num });
      }
    );
    socket.addListener(
      Event.ONLINE_RANK_COUNT,
      ({
        data: {
          data: { count }
        }
      }): void => {
        super.emit(Event.ONLINE_RANK_COUNT, { count });
      }
    );
    socket.addListener(
      Event.LIKE_INFO_V3_CLICK,
      ({
        data: {
          data: { uname, like_text }
        }
      }): void => {
        super.emit(Event.LIKE_INFO_V3_CLICK, {
          uname,
          like_text
        });
      }
    );
    socket.addListener(Event.DANMU_MSG, ({ data }): void => {
      const [danmu, username]: Array<string> = [
        data.info.at(1),
        data.info.at(2).at(1)
      ];
      super.emit(Event.DANMU_MSG, {
        danmu,
        username
      });
    });
    socket.addListener(
      Event.SEND_GIFT,
      ({
        data: {
          data: { uname, action, giftName, num }
        }
      }): void => {
        super.emit(Event.SEND_GIFT, { uname, action, giftName, num });
      }
    );
  }

  public addService<T>(
    event: Event,
    cb: (data: T) => void,
    status: boolean = false
  ): void {
    if (status) super.addListener(event, cb);
  }

  public giftDebounce<T extends IGift>(
    cb: ({ uname, action, giftName, num }: T) => void,
    { uname, action, giftName, num }: T
  ) {
    const key = encode(`${uname}|${action}|${giftName}|${num}`);
    if (!BiliBiliService.GiftHashMap.has(key)) {
      BiliBiliService.GiftHashMap.set(
        key,
        this.debounce(
          key,
          ({ uname, action, giftName }: IGift): void =>
            cb({
              uname,
              action,
              giftName,
              num: BiliBiliService.GiftHashMap.get(`${key}num`) as number
            } as T),
          2
        )
      );
    }
    BiliBiliService.GiftHashMap.set(
      `${key}num`,
      (BiliBiliService.GiftHashMap.get(`${key}num`) || 0) + num
    );
    BiliBiliService.GiftHashMap.get(key)({ uname, action, giftName });
  }
  private debounce<T>(
    key: string,
    cb: { (data: IGift): void; (data: T): void },
    delay: number = 1
  ): (arg: T) => void {
    let time: NodeJS.Timeout;
    return function (data: T): void {
      clearTimeout(time);
      time = setTimeout(() => {
        cb(data);
        BiliBiliService.GiftHashMap.delete(key);
        BiliBiliService.GiftHashMap.delete(`${key}num`);
      }, delay * 1000);
    };
  }
}

export default BiliBiliService;
