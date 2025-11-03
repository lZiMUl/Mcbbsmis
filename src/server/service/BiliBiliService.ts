import EventEmitter from 'node:events';
import { createHash } from 'node:crypto';
import protobuf, { Type } from 'protobufjs';
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
import {
  IOnlineCount,
  ISendDanmaku,
  ISendGift,
  IUserFollow,
  IUserJoin,
  IUserLike,
  IUserShare,
  IViewCount
} from '../interface/IListenerResult';
import Config from '../config';
import BaseUnit from '../unit/BaseUnit';

class BiliBiliService extends EventEmitter {
  private static GiftHashMap: Map<string, any> = new Map<string, any>();
  private readonly InteractWordV2: Type = protobuf
    .loadSync(Config.PROTO_FILE_PATH)
    .lookupType('InteractWordV2');

  public constructor(socket: KeepLiveWS) {
    super();

    socket.addListener('msg', ({ data }: Message<any>): void => {
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
                super.emit<IUserJoin>(LiveEventEnum.USER_JOIN, { uname });
              }
              break;

            case 'MSG_FOLLOW':
              {
                super.emit<IUserFollow>(LiveEventEnum.USER_FOLLOW, { uname });
              }
              break;
            case 'MSG_SHARE_ROOM':
              {
                super.emit<IUserShare>(LiveEventEnum.USER_SHARE, { uname });
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
        super.emit<IViewCount>(LiveEventEnum.VIEW_COUNT, { num });
      }
    );
    socket.addListener(
      'ONLINE_RANK_COUNT',
      ({
        data: {
          data: { count }
        }
      }: Message<ONLINE_RANK_COUNT>): void => {
        super.emit<IOnlineCount>(LiveEventEnum.ONLINE_COUNT, { count });
      }
    );
    socket.addListener(
      'LIKE_INFO_V3_CLICK',
      ({
        data: {
          data: { uname, like_text }
        }
      }: Message<LIKE_INFO_V3_CLICK>): void => {
        super.emit<IUserLike>(LiveEventEnum.USER_LIKE, {
          uname,
          like_text
        });
      }
    );
    socket.addListener('DANMU_MSG', ({ data }: Message<DANMU_MSG>): void => {
      super.emit<ISendDanmaku>(LiveEventEnum.SEND_DANMAKU, {
        danmu: data.info.at(1),
        uname: data.info.at(2).at(1),
        medalStatus: Boolean<number | undefined>(data.info.at(3)?.length),
        medalLevel: data.info.at(3).at(0),
        medalName: data.info.at(3).at(1)
      });
    });
    socket.addListener(
      'SEND_GIFT',
      ({
        data: {
          data: { uname, action, giftName, num }
        }
      }: Message<SEND_GIFT>): void => {
        super.emit<SEND_GIFT>(LiveEventEnum.SEND_GIFT, {
          uname,
          action,
          giftName,
          num
        });
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
        BaseUnit.debounce<ISendGift>(
          ({ uname, action, giftName }: ISendGift): void => {
            cb({
              uname,
              action,
              giftName,
              num: BiliBiliService.GiftHashMap.get(`${key}num`) as number
            } as T);

            BiliBiliService.GiftHashMap.delete(key);
            BiliBiliService.GiftHashMap.delete(`${key}num`);
          },
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
}

export default BiliBiliService;
