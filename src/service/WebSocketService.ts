import BiliSender, { IConfig } from 'bili-sender';
import { RawData, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import IEventResult from '../interface/IEventResult';
import MinecraftService from './MinecraftService';
import ICommandResult from '../interface/ICommandResult';

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

  private constructor(
    host: string = Config.get('global', 'host'),
    port: number = Config.get('global', 'port')
  ) {
    super({ host, port });
    this.host = host;
    this.port = port;
    this.core();
  }

  public static create(): WebsocketService {
    if (!WebsocketService.websocketService) {
      WebsocketService.websocketService = new WebsocketService();
    }
    return WebsocketService.websocketService;
  }

  public async core(): Promise<void> {
    try {
      const { KeepLiveWS } = await this.tinyBiliWs;

      const client = new KeepLiveWS(Config.get('bilibili', 'roomid'), {
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
      super.addListener('connection', (socket): void => {
        Config.LOGGER.info(Config.LANGUAGE.get('#22'));
        this.minecraft = new MinecraftService(socket);
        this.minecraft?.sendMessage(
          `§l§o§9Connect Status §l§o§a${Config.LANGUAGE.get('#22')}`
        );
        client.addListener(
          'LIKE_INFO_V3_CLICK',
          ({
            data: {
              data: { uname, like_text }
            }
          }): void => {
            Config.LOGGER.info(`[${uname}]: ${like_text}`);
            this.minecraft?.sendMessage(
              `§l§o§9Like §l§o§b[§l§o§c${uname}§l§o§b]§l§o§d: §l§o§g${like_text}`
            );
          }
        );

        client.addListener('DANMU_MSG', ({ data }): void => {
          const [danmu, username]: Array<string> = [
            data.info.at(1),
            data.info.at(2).at(1)
          ];
          Config.LOGGER.info(`[${username}]: ${danmu}`);
          this.minecraft?.sendMessage(
            `§l§o§9Barrage §l§o§b[§l§o§c${username}§l§o§b]§l§o§d: §l§o§6${danmu}`
          );
        });

        client.addListener(
          'SEND_GIFT',
          ({
            data: {
              data: { uname, action, giftName, num }
            }
          }): void => {
            Config.LOGGER.info(`[${uname}]: ${action} ${giftName} * ${num}`);
            this.minecraft?.sendMessage(
              `§l§o§9Gift §l§o§b[§l§o§c${uname}§l§o§b]§l§o§d: §l§o§6${action} §l§o§b${giftName} §l§o§6* §l§o§a${num}`
            );
          }
        );
        socket.addListener('message', (rawData: RawData): void => {
          this.parseEventResult(rawData.toString());
        });
      });

      ['error', 'close', 'wsClientError'].forEach((event: string): void => {
        super.addListener(event, (): boolean => client.close());
      });
    } catch (err) {}
  }

  private parseEventResult(rawData: string): void {
    const {
      body: { message, sender, type }
    }: IEventResult = JSON.parse(rawData);

    switch (type) {
      case 'chat':
        {
          if (sender === Config.get('xbox', 'username')) {
            const { identifier, command, content }: ICommandResult =
              MinecraftService.parseCommand(message);
            if (identifier === (Config.get('global', 'identifier') || '$')) {
              switch (command) {
                case 'help':
                  {
                    this.minecraft?.sendMessage(
                      `§l§o§9Helper §l§o§a${Config.LANGUAGE.get('#23')}`
                    );
                  }
                  break;
                case '送':
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
