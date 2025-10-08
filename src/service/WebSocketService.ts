import BiliSender, { IConfig } from 'bili-sender';
import { RawData, Server, WebSocket, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import IEventResult from '../interface/IEventResult';
import MinecraftService from './MinecraftService';
import ICommandResult from '../interface/ICommandResult';
import BiliBiliService from './BiliBiliService';
import { Event } from '../enum/ListenerEnum';
import {
  WATCH,
  ONLINE,
  ILike,
  IDanmu,
  IGift,
  Share
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
      super.addListener(
        'connection',
        (socket: InstanceType<typeof WebSocket.WebSocket>): void => {
          Config.LOGGER.info(Config.LANGUAGE.get('#22'));
          this.minecraft = new MinecraftService(socket);
          this.minecraft?.sendMessage(
            `§9Connect Status §a${Config.LANGUAGE.get('#22')}`
          );
          const [watchStatus, onlineStatus]: Array<boolean> = [
            Config.get('options', 'watch'),
            Config.get('options', 'online')
          ];
          tickerService.tick((): void => {
            const ActionBar: Array<string> = [];

            if (watchStatus)
              ActionBar.push(
                `§f${Config.LANGUAGE.get('#25')}§d: §b[§f${
                  tickerService.getData<number>(Event.WATCHED_CHANGE) ||
                  Config.LANGUAGE.get('#24')
                }§b]`
              );
            if (onlineStatus)
              ActionBar.push(
                `§f${Config.LANGUAGE.get('#26')}§d: §b[§f${
                  tickerService.getData<number>(Event.ONLINE_RANK_COUNT) ||
                  Config.LANGUAGE.get('#24')
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
      type dataType = string | number;
      const tickerService: TickerService<dataType> =
        new TickerService<dataType>();

      biliBiliService.addService<WATCH>(
        Event.WATCHED_CHANGE,
        ({ num }: WATCH): void => {
          tickerService.setData(Event.WATCHED_CHANGE, num);
        },
        Config.get('options', 'watch')
      );
      biliBiliService.addService<ONLINE>(
        Event.ONLINE_RANK_COUNT,
        ({ count }: ONLINE): void => {
          tickerService.setData(Event.ONLINE_RANK_COUNT, count);
        },
        Config.get('options', 'online')
      );

      biliBiliService.addService<ILike>(
        Event.LIKE_INFO_V3_CLICK,
        ({ uname, like_text }: ILike): void => {
          Config.LOGGER.info(`[${uname}]: ${like_text}`);
          this.minecraft?.sendMessage(
            `§9Like §b[§c${uname}§b]§d: §g${like_text}`
          );
        },
        Config.get('options', 'like')
      );
      biliBiliService.addService<IDanmu>(
        Event.DANMU_MSG,
        ({ username, danmu }: IDanmu): void => {
          Config.LOGGER.info(`[${username}]: ${danmu}`);
          this.minecraft?.sendMessage(
            `§9Barrage §b[§c${username}§b]§d: §6${danmu}`
          );
        },
        Config.get('options', 'danmu')
      );
      biliBiliService.addService<IGift>(
        Event.SEND_GIFT,
        ({ uname, action, giftName, num }: IGift): void => {
          biliBiliService.giftDebounce(
            ({ uname, action, giftName, num }: IGift): void => {
              Config.LOGGER.info(`[${uname}]: ${action} ${giftName} * ${num}`);
              this.minecraft?.sendMessage(
                `§9Gift §b[§c${uname}§b]§d: §6${action} §b${giftName} §6* §a${num}`
              );
            },
            { uname, action, giftName, num }
          );
        },
        Config.get('options', 'gift')
      );
      biliBiliService.addService(
        Event.DM_INTERACTION,
        ({ suffix_text }: Share): void => {
          tickerService.setData(Event.DM_INTERACTION, suffix_text);
        },
        Config.get('options', 'share')
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
