import BiliSender, { IConfig } from 'bili-sender';
import { RawData, Server, WebSocket, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import MinecraftService from './MinecraftService';
import BiliBiliService from './BiliBiliService';
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
import TickerService from './TickerService';
import BaseUnit from '../unit/BaseUnit';

class WebsocketService extends WebSocketServer {
  private static websocketService: WebsocketService;
  private readonly auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  private readonly userConfig: IConfig = {
    Cookie: this.auth.get(Config.APP_UUID)
  };
  private readonly roomId: number = Config.get('bilibili', 'roomid') || 9329583;
  private readonly bili: BiliSender = new BiliSender(
    this.roomId,
    this.userConfig
  );
  private readonly tinyBiliWs = import('tiny-bilibili-ws');
  private minecraft: MinecraftService | undefined;
  private tickerService: TickerService<string | number | null> =
    new TickerService<string | number | null>();
  private readonly host: string;
  private readonly port: number;

  private constructor(host: string, port: number) {
    super({ host, port });
    this.host = host;
    this.port = port;
    this.core();
  }

  public static create(): WebsocketService {
    if (!WebsocketService.websocketService) {
      WebsocketService.websocketService = new WebsocketService(
        Config.get('global', 'host') || '0.0.0.0',
        Config.get('global', 'port') || 5700
      );
    }
    return WebsocketService.websocketService;
  }

  public async core(): Promise<void> {
    try {
      super.addListener(
        'connection',
        (socket: InstanceType<typeof WebSocket.WebSocket>): void => {
          Config.LOGGER.info(Config.LANGUAGE.get('#22'));
          this.minecraft = new MinecraftService(socket);
          this.minecraft?.sendMessage(
            `§9Status §a${Config.LANGUAGE.get('#22')}`
          );
          socket.addListener('message', (rawData: RawData): void => {
            this.minecraft?.parseEventResult(rawData.toString(), this.bili);
          });
        }
      );

      const [
        loadingText,
        joinText,
        followText,
        shareText,
        viewText,
        onlineText,
        likeText
      ]: Array<string> = [
        Config.LANGUAGE.get('#24'),
        Config.LANGUAGE.get('#27'),
        Config.LANGUAGE.get('#28'),
        Config.LANGUAGE.get('#29'),
        Config.LANGUAGE.get('#25'),
        Config.LANGUAGE.get('#26'),
        Config.LANGUAGE.get('#30')
      ];
      const [
        joinStatus,
        followStatus,
        shareStatus,
        viewStatus,
        onlineStatus,
        likeStatus,
        danmakuStatus,
        giftStatus
      ]: Array<boolean> = [
        Config.get('options', 'join') || false,
        Config.get('options', 'follow') || false,
        Config.get('options', 'share') || false,
        Config.get('options', 'view') || false,
        Config.get('options', 'online') || false,
        Config.get('options', 'like') || true,
        Config.get('options', 'danmaku') || true,
        Config.get('options', 'gift') || true
      ];

      const { KeepLiveWS } = await this.tinyBiliWs;

      const client = new KeepLiveWS(this.roomId, {
        headers: {
          Cookie: this.auth.get(Config.APP_UUID)
        },
        uid: Config.get('bilibili', 'userid') || 291883246
      });

      this.tickerService.tick((): void => {
        const ActionBar: Array<string> = [];
        const joinUser: string | null = this.tickerService.getData<string>(
          LiveEventEnum.USER_JOIN
        );

        if (joinStatus && joinUser) {
          ActionBar.push(
            `§f${joinText.replace('%s', `§b[§c${joinUser}§b]§f`)}`
          );
        }

        if (viewStatus)
          ActionBar.push(
            `§f${viewText}§d: §b[§f${
              this.tickerService.getData<number>(LiveEventEnum.VIEW_COUNT) ||
              loadingText
            }§b]`
          );
        if (onlineStatus)
          ActionBar.push(
            `§f${onlineText}§d: §b[§f${
              this.tickerService.getData<number>(LiveEventEnum.ONLINE_COUNT) ||
              loadingText
            }§b]`
          );
        if (ActionBar.length)
          this.minecraft?.sendActionBar(ActionBar.join(' §g| '));
      }, 0.45);

      Config.LOGGER.info(Config.LANGUAGE.get('#16'));
      await client.runWhenConnected();
      Config.LOGGER.info(Config.LANGUAGE.get('#17'));
      Config.LOGGER.info(
        `${Config.LANGUAGE.get('#18')} => /connect ws://${this.host === '0.0.0.0' ? '127.0.0.1' : this.host}:${this.port}`
      );

      const biliBiliService: BiliBiliService = new BiliBiliService(client);
      const hideUserJoin: (data: null) => void = BaseUnit.debounce(
        (data: null): void => {
          this.tickerService.setData(LiveEventEnum.USER_JOIN, data);
        },
        10
      );
      biliBiliService.addService<IUserJoin>(
        LiveEventEnum.USER_JOIN,
        ({ uname }: IUserJoin): void => {
          Config.LOGGER.info(`${joinText.replace('%s', `[${uname}]`)}`);
          this.tickerService.setData(LiveEventEnum.USER_JOIN, uname);
          hideUserJoin(null);
        },
        joinStatus
      );
      biliBiliService.addService<IUserFollow>(
        LiveEventEnum.USER_FOLLOW,
        ({ uname }: IUserFollow): void => {
          Config.LOGGER.info(`[${uname}]: ${followText}`);
          this.minecraft?.sendMessage(
            `§9Follow §b[§c${uname}§b]§d: §g${followText}`
          );
        },
        followStatus
      );
      biliBiliService.addService<IUserShare>(
        LiveEventEnum.USER_SHARE,
        ({ uname }: IUserShare): void => {
          Config.LOGGER.info(`[${uname}]: ${shareText}`);
          this.minecraft?.sendMessage(
            `§9Share §b[§c${uname}§b]§d: §v${shareText}`
          );
        },
        shareStatus
      );
      biliBiliService.addService<IViewCount>(
        LiveEventEnum.VIEW_COUNT,
        ({ num }: IViewCount): void => {
          this.tickerService.setData(LiveEventEnum.VIEW_COUNT, num);
        },
        viewStatus
      );
      biliBiliService.addService<IOnlineCount>(
        LiveEventEnum.ONLINE_COUNT,
        ({ count }: IOnlineCount): void => {
          this.tickerService.setData(LiveEventEnum.ONLINE_COUNT, count);
        },
        onlineStatus
      );

      biliBiliService.addService<IUserLike>(
        LiveEventEnum.USER_LIKE,
        ({ uname }: IUserLike): void => {
          Config.LOGGER.info(`[${uname}]: ${likeText}`);
          this.minecraft?.sendMessage(
            `§9Like §b[§c${uname}§b]§d: §5${likeText}`
          );
        },
        likeStatus
      );
      biliBiliService.addService<ISendDanmaku>(
        LiveEventEnum.SEND_DANMAKU,
        ({
          uname,
          danmu,
          medalStatus,
          medalLevel,
          medalName
        }: ISendDanmaku): void => {
          const medal: string = medalStatus
            ? `§6(${medalName} ${medalLevel}) `
            : '';
          Config.LOGGER.info(`[${medal.replace('§6', '')}${uname}]: ${danmu}`);
          this.minecraft?.sendMessage(
            `§9Danmaku §b[${medal}§c${uname}§b]§d: §b${danmu}`
          );
        },
        danmakuStatus
      );
      biliBiliService.addService<ISendGift>(
        LiveEventEnum.SEND_GIFT,
        ({ uname, action, giftName, num }: ISendGift): void => {
          biliBiliService.giftDebounce(
            ({ uname, action, giftName, num }: ISendGift): void => {
              Config.LOGGER.info(`[${uname}]: ${action} ${giftName} * ${num}`);
              this.minecraft?.sendMessage(
                `§9Gift §b[§c${uname}§b]§d: §6${action} §b${giftName} §6* §a${num}`
              );
            },
            { uname, action, giftName, num }
          );
        },
        giftStatus
      );

      ['error', 'close', 'wsClientError'].forEach(
        (event: string): Server =>
          super.addListener(event, (): boolean => client.close())
      );
    } catch (err: unknown) {}
  }
}

export default WebsocketService;
