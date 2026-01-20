import BiliSender, { IConfig } from 'bili-sender';
import { RawData, Server, WebSocket, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import MinecraftService from './MinecraftService';
import BiliBiliService from './BiliBiliService';
import { ELiveEvent } from '../enum/ELiveEvent';
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
import NotificationService from './NotificationService';

class WebsocketService extends WebSocketServer {
  private static INSTANCE: WebsocketService;
  private readonly auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  private readonly userConfig: IConfig = {
    Cookie: this.auth.get(Config.APP_UUID)
  };
  private readonly roomId: number = Config.get('bilibili', 'roomid');
  private readonly userName: string = Config.get('bilibili', 'username');
  private readonly userid: number = Config.get('bilibili', 'userid');
  private readonly resourcePack: boolean = Config.get('xbox', 'resourcePack');
  private readonly notificationService: NotificationService =
    new NotificationService(
      Config.NETWORK_URL.BaseUrl,
      Config.NETWORK_URL.NotificationsPath
    );

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
    this.core().then((v: void): void => v);
  }

  public static create(): WebsocketService {
    if (!WebsocketService.INSTANCE) {
      WebsocketService.INSTANCE = new WebsocketService(
        Config.get('global', 'host'),
        Config.get('global', 'port')
      );
    }
    return WebsocketService.INSTANCE;
  }

  public async core(): Promise<void> {
    try {
      super.addListener('listening', (): void => {
        Config.LOGGER.info(
          `${Config.LANGUAGE.get('#18')} => /connect ws://${this.host === '0.0.0.0' ? '127.0.0.1' : this.host}:${this.port}`
        );
      });
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
        Config.get('options', 'join'),
        Config.get('options', 'follow'),
        Config.get('options', 'share'),
        Config.get('options', 'view'),
        Config.get('options', 'online'),
        Config.get('options', 'like'),
        Config.get('options', 'danmaku'),
        Config.get('options', 'gift')
      ];

      const { KeepLiveWS } = await this.tinyBiliWs;

      await this.notificationService.notifications({
        roomId: this.roomId,
        userName: this.userName,
        userId: this.userid
      });

      const client = new KeepLiveWS(this.roomId, {
        headers: {
          Cookie: this.auth.get(Config.APP_UUID)
        },
        uid: this.userid
      });

      this.tickerService.tick((): void => {
        const ActionBar: Array<string> = [];
        const joinUser: string | null = this.tickerService.getData<string>(
          ELiveEvent.USER_JOIN
        );

        if (joinStatus && joinUser) {
          ActionBar.push(
            `§f${joinText.replace('%s', `§b[§c${joinUser}§b]§f`)}`
          );
        }

        if (viewStatus)
          ActionBar.push(
            `§f${viewText}§d: §b[§f${
              this.tickerService.getData<number>(ELiveEvent.VIEW_COUNT) ||
              loadingText
            }§b]`
          );
        if (onlineStatus)
          ActionBar.push(
            `§f${onlineText}§d: §b[§f${
              this.tickerService.getData<number>(ELiveEvent.ONLINE_COUNT) ||
              loadingText
            }§b]`
          );
        if (ActionBar.length)
          this.minecraft?.sendActionBar(ActionBar.join(' §g| '));
      }, 0.45);

      Config.LOGGER.info(Config.LANGUAGE.get('#16'));
      await client.runWhenConnected();
      Config.LOGGER.info(Config.LANGUAGE.get('#17'));

      const biliBiliService: BiliBiliService = new BiliBiliService(client);
      const hideUserJoin: (data: null) => void = BaseUnit.debounce(
        (data: null): void => {
          this.tickerService.setData(ELiveEvent.USER_JOIN, data);
        },
        10
      );
      biliBiliService.addService<IUserJoin>(
        ELiveEvent.USER_JOIN,
        ({ uname }: IUserJoin): void => {
          Config.LOGGER.info(`${joinText.replace('%s', `[${uname}]`)}`);
          this.tickerService.setData(ELiveEvent.USER_JOIN, uname);
          hideUserJoin(null);
        },
        joinStatus
      );
      biliBiliService.addService<IUserFollow>(
        ELiveEvent.USER_FOLLOW,
        ({ uname }: IUserFollow): void => {
          Config.LOGGER.info(`[${uname}]: ${followText}`);
          this.minecraft?.sendMessage(
            `§9Follow §b[§c${uname}§b]§d: §g${followText}`
          );
        },
        followStatus
      );
      biliBiliService.addService<IUserShare>(
        ELiveEvent.USER_SHARE,
        ({ uname }: IUserShare): void => {
          Config.LOGGER.info(`[${uname}]: ${shareText}`);
          this.minecraft?.sendMessage(
            `§9Share §b[§c${uname}§b]§d: §v${shareText}`
          );
        },
        shareStatus
      );
      biliBiliService.addService<IViewCount>(
        ELiveEvent.VIEW_COUNT,
        ({ num }: IViewCount): void => {
          this.tickerService.setData(ELiveEvent.VIEW_COUNT, num);
        },
        viewStatus
      );
      biliBiliService.addService<IOnlineCount>(
        ELiveEvent.ONLINE_COUNT,
        ({ count }: IOnlineCount): void => {
          this.tickerService.setData(ELiveEvent.ONLINE_COUNT, count);
        },
        onlineStatus
      );

      biliBiliService.addService<IUserLike>(
        ELiveEvent.USER_LIKE,
        ({ uname }: IUserLike): void => {
          Config.LOGGER.info(`[${uname}]: ${likeText}`);
          this.minecraft?.sendMessage(
            `§9Like §b[§c${uname}§b]§d: §5${likeText}`
          );
        },
        likeStatus
      );

      biliBiliService.addService<ISendDanmaku>(
        ELiveEvent.SEND_DANMAKU,
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
            `§9Danmaku §b[${medal}§c${uname}§b]§d: §b${
              this.resourcePack
                ? danmu.replace(/\[([^\]]+)\]/g, (name: string): string =>
                    Config.EMOJIS.getCodeByName(name)
                  )
                : danmu
            }`
          );
        },
        danmakuStatus
      );
      biliBiliService.addService<ISendGift>(
        ELiveEvent.SEND_GIFT,
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
