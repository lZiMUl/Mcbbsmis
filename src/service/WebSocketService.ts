import BiliSender, { IConfig } from 'bili-sender';
import { RawData, Server, WebSocket, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import IEventResult from '../interface/IEventResult';
import MinecraftService from './MinecraftService';
import ICommandResult from '../interface/ICommandResult';
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

class WebsocketService extends WebSocketServer {
  private static websocketService: WebsocketService;
  private readonly auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  private readonly userConfig: IConfig = {
    Cookie: this.auth.get(Config.APP_UUID)
  };
  private readonly roomId: number = Config.get('bilibili', 'roomid');
  private readonly bili: BiliSender = new BiliSender(
    this.roomId,
    this.userConfig
  );
  private readonly tinyBiliWs = import('tiny-bilibili-ws');
  private minecraft: MinecraftService | undefined;
  private tickerService: TickerService<string | number> = new TickerService<
    string | number
  >();
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
        Config.get('global', 'host'),
        Config.get('global', 'port')
      );
    }
    return WebsocketService.websocketService;
  }

  public async core(): Promise<void> {
    try {
      const [
        loading,
        joinText,
        followText,
        shareText,
        viewText,
        onlineText
      ]: Array<string> = [
        Config.LANGUAGE.get('#24'),
        Config.LANGUAGE.get('#27'),
        Config.LANGUAGE.get('#28'),
        Config.LANGUAGE.get('#29'),
        Config.LANGUAGE.get('#25'),
        Config.LANGUAGE.get('#26')
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

      super.addListener(
        'connection',
        (socket: InstanceType<typeof WebSocket.WebSocket>): void => {
          Config.LOGGER.info(Config.LANGUAGE.get('#22'));
          this.minecraft = new MinecraftService(socket);
          this.minecraft?.sendMessage(
            `§9Status §a${Config.LANGUAGE.get('#22')}`
          );

          this.tickerService.tick((): void => {
            const ActionBar: Array<string> = [];

            const joinUser: string | null = this.tickerService.getData<string>(
              LiveEventEnum.USER_JOIN
            );
            if (joinStatus && joinUser) {
              ActionBar.push(
                `§f${joinText.replaceAll('%s', `§b[§c${joinUser}§b]§f`)}`
              );
            }

            if (viewStatus)
              ActionBar.push(
                `§f${viewText}§d: §b[§f${
                  this.tickerService.getData<number>(
                    LiveEventEnum.VIEW_COUNT
                  ) || loading
                }§b]`
              );
            if (onlineStatus)
              ActionBar.push(
                `§f${onlineText}§d: §b[§f${
                  this.tickerService.getData<number>(
                    LiveEventEnum.ONLINE_COUNT
                  ) || loading
                }§b]`
              );
            if (ActionBar.length)
              this.minecraft?.sendActionBar(ActionBar.join(' §g| '));
          }, 0.45);
          socket.addListener('message', (rawData: RawData): void => {
            this.parseEventResult(rawData.toString());
          });
        }
      );

      const { KeepLiveWS } = await this.tinyBiliWs;

      const client = new KeepLiveWS(this.roomId, {
        headers: {
          Cookie: this.auth.get(Config.APP_UUID)
        },
        uid: Config.get('bilibili', 'userid')
      });

      Config.LOGGER.info(Config.LANGUAGE.get('#16'));
      await client.runWhenConnected();
      Config.LOGGER.info(Config.LANGUAGE.get('#17'));
      Config.LOGGER.info(
        `${Config.LANGUAGE.get('#18')} => /connect ws://${this.host === '0.0.0.0' ? '127.0.0.1' : this.host}:${this.port}`
      );

      const biliBiliService: BiliBiliService = new BiliBiliService(client);

      biliBiliService.addService<IUserJoin>(
        LiveEventEnum.USER_JOIN,
        ({ uname }: IUserJoin): void => {
          Config.LOGGER.info(`${joinText.replaceAll('%s', `[${uname}]`)}`);
          this.tickerService.setData(LiveEventEnum.USER_JOIN, uname);
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
        ({ uname, like_text }: IUserLike): void => {
          Config.LOGGER.info(`[${uname}]: ${like_text}`);
          this.minecraft?.sendMessage(
            `§9Like §b[§c${uname}§b]§d: §5${like_text}`
          );
        },
        likeStatus
      );
      biliBiliService.addService<ISendDanmaku>(
        LiveEventEnum.SEND_DANMAKU,
        ({ username, danmu }: ISendDanmaku): void => {
          Config.LOGGER.info(`[${username}]: ${danmu}`);
          this.minecraft?.sendMessage(
            `§9Barrage §b[§c${username}§b]§d: §b${danmu}`
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
    } catch (err) {}
  }

  private parseEventResult(rawData: string): void {
    const {
      body: { message, sender, type }
    }: IEventResult = JSON.parse(rawData);

    switch (type) {
      case 'chat':
        {
          if (sender === this.minecraft?.player) {
            const { identifier, command, content }: ICommandResult =
              MinecraftService.parseCommand(message);
            if (identifier === (Config.get('global', 'identifier') || '$')) {
              switch (command) {
                case 'help':
                  {
                    this.minecraft?.sendMessage(
                      `§9Helper §a${Config.LANGUAGE.get('#23')}`
                    );
                  }
                  break;
                case 'send':
                  {
                    this.bili.send(content);
                  }
                  break;

                case 'config': {
                  this.minecraft?.sendMessage(Config.LANGUAGE.get('#-1'));
                  break;
                }

                default: {
                  this.minecraft?.sendMessage(Config.LANGUAGE.get('#20'));
                }
              }
            }
          }
        }
        break;
    }
  }
}

export default WebsocketService;
