import EventEmitter from 'node:events';
import protobuf from 'protobufjs';
import { createHash } from 'node:crypto';
import {
  DANMU_MSG,
  KeepLiveWS,
  LIKE_INFO_V3_CLICK,
  Message,
  ONLINE_RANK_COUNT,
  SEND_GIFT,
  WATCHED_CHANGE
} from 'tiny-bilibili-ws';

import { LiveEventEnum } from '../enum/LiveEventEnum';
import { ISendGift } from '../interface/IListenerResult';
import Config from '../config';

class BiliBiliService extends EventEmitter {
  private static GiftHashMap: Map<string, any> = new Map<string, any>();
  private readonly InteractWordV2 = protobuf
    .loadSync(Config.PROTO_FILE_PATH)
    .lookupType('InteractWordV2');

  public constructor(socket: KeepLiveWS) {
    super();

    socket.addListener('msg', ({ data }) => {
      switch (data.cmd) {
        case 'INTERACT_WORD_V2': {
          const { msgType, uname } = this.InteractWordV2?.decode(
            Buffer.from(data.data.pb, 'base64')
          ).toJSON() as {
            msgType: 'MSG_ENTER_ROOM' | 'MSG_FOLLOW' | 'MSG_SHARE_ROOM';
            uname: string;
          };

          switch (msgType) {
            case 'MSG_ENTER_ROOM':
              {
                super.emit(LiveEventEnum.USER_JOIN, { uname });
              }
              break;

            case 'MSG_FOLLOW':
              {
                super.emit(LiveEventEnum.USER_FOLLOW, { uname });
              }
              break;
            case 'MSG_SHARE_ROOM':
              {
                super.emit(LiveEventEnum.USER_SHARE, { uname });
              }
              break;
          }
        }
      }
    });

    socket.addListener(
      'WATCHED_CHANGE',
      ({
        data: {
          data: { num }
        }
      }: Message<WATCHED_CHANGE>): void => {
        super.emit(LiveEventEnum.VIEW_COUNT, { num });
      }
    );
    socket.addListener(
      'ONLINE_RANK_COUNT',
      ({
        data: {
          data: { count }
        }
      }: Message<ONLINE_RANK_COUNT>): void => {
        super.emit(LiveEventEnum.ONLINE_COUNT, { count });
      }
    );
    socket.addListener(
      'LIKE_INFO_V3_CLICK',
      ({
        data: {
          data: { uname, like_text }
        }
      }: Message<LIKE_INFO_V3_CLICK>): void => {
        super.emit(LiveEventEnum.USER_LIKE, {
          uname,
          like_text
        });
      }
    );
    socket.addListener('DANMU_MSG', ({ data }: Message<DANMU_MSG>): void => {
      const [danmu, username]: Array<string> = [
        data.info.at(1),
        data.info.at(2).at(1)
      ];
      super.emit(LiveEventEnum.SEND_DANMAKU, {
        danmu,
        username
      });
    });
    socket.addListener(
      'SEND_GIFT',
      ({
        data: {
          data: { uname, action, giftName, num }
        }
      }: Message<SEND_GIFT>): void => {
        super.emit(LiveEventEnum.SEND_GIFT, { uname, action, giftName, num });
      }
    );
  }

  public addService<T>(
    event: LiveEventEnum,
    cb: (data: T) => void,
    status: boolean = false
  ): void {
    if (status) super.addListener(event, cb);
  }

  public giftDebounce<T extends ISendGift>(
    cb: ({ uname, action, giftName, num }: T) => void,
    { uname, action, giftName, num }: T
  ): void {
    const key: string = createHash('MD5')
      .update(`${uname}|${action}|${giftName}|${num}`)
      .digest('hex');
    if (!BiliBiliService.GiftHashMap.has(key)) {
      BiliBiliService.GiftHashMap.set(
        key,
        this.debounce(
          key,
          ({ uname, action, giftName }: ISendGift): void =>
            cb({
              uname,
              action,
              giftName,
              num: BiliBiliService.GiftHashMap.get(`${key}num`) as number
            } as T),
          1.2
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
    cb: { (data: ISendGift): void; (data: T): void },
    delay: number = 1
  ): (arg: T) => void {
    let time: NodeJS.Timeout;
    return function (data: T): void {
      clearTimeout(time);
      time = setTimeout((): void => {
        cb(data);
        BiliBiliService.GiftHashMap.delete(key);
        BiliBiliService.GiftHashMap.delete(`${key}num`);
      }, delay * 1000);
    };
  }
}

export default BiliBiliService;
