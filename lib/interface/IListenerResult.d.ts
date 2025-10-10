interface IUserBase {
    uname: string;
}
interface IUserJoin extends IUserBase {
}
interface IUserFollow extends IUserBase {
}
interface IUserShare extends IUserBase {
}
interface IViewCount {
    num: number;
}
interface IOnlineCount {
    count: number;
}
interface IUserLike extends IUserBase {
    like_text: string;
}
interface ISendDanmaku {
    danmu: string;
    username: string;
}
interface ISendGift {
    uname: string;
    action: string;
    giftName: string;
    num: number;
}
export type { IUserJoin, IUserFollow, IUserShare, IViewCount, IOnlineCount, IUserLike, ISendDanmaku, ISendGift };
//# sourceMappingURL=IListenerResult.d.ts.map