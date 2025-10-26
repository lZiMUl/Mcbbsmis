interface IUserBase {
  uname: string;
}

interface IUserJoin extends IUserBase {}

interface IUserFollow extends IUserBase {}

interface IUserShare extends IUserBase {}

interface IViewCount {
  num: number;
}

interface IOnlineCount {
  count: number;
}

interface IUserLike extends IUserBase {}

interface ISendDanmaku extends IUserBase {
  danmu: string;
  medalStatus: boolean;
  medalLevel: number;
  medalName: string;
}

interface ISendGift extends IUserBase {
  action: string;
  giftName: string;
  num: number;
}

export type {
  IUserJoin,
  IUserFollow,
  IUserShare,
  IViewCount,
  IOnlineCount,
  IUserLike,
  ISendDanmaku,
  ISendGift
};
