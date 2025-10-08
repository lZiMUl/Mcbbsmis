interface ILike {
    uname: string;
    like_text: string;
}
interface IDanmu {
    danmu: string;
    username: string;
}
interface IGift {
    uname: string;
    action: string;
    giftName: string;
    num: number;
}
interface Share {
    fade_duration: number;
    cnt: number;
    card_appear_interval: number;
    suffix_text: string;
    reset_cnt: number;
    display_flag: number;
}
interface ONLINE {
    count: number;
    count_text: string;
    online_count: string;
    online_count_text: string;
}
interface WATCH {
    num: number;
    text_small: string;
    text_large: string;
}
export type { ONLINE, WATCH, ILike, IDanmu, IGift, Share };
//# sourceMappingURL=IListenerResult.d.ts.map